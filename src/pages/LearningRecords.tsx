import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, BookOpen, Edit, Trash2, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';

const LearningRecords: React.FC = () => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', chapterId: '' });
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  
  const {
    user,
    chapters,
    fetchChapters,
    learningProgress,
    fetchLearningProgress,
    notes,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote
  } = useStore();

  useEffect(() => {
    fetchChapters();
    if (user) {
      fetchLearningProgress();
      fetchNotes();
    }
  }, [fetchChapters, fetchLearningProgress, fetchNotes, user]);

  // Calculate learning progress
  const completedChapters = learningProgress.filter(p => p.completed).length;
  const totalChapters = chapters.length;
  const progressPercentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  // Get completed chapters
  const completedChapterDetails = chapters
    .filter(chapter => learningProgress.some(p => p.chapter_id === chapter.id && p.completed))
    .sort((a, b) => {
      const progressA = learningProgress.find(p => p.chapter_id === a.id);
      const progressB = learningProgress.find(p => p.chapter_id === b.id);
      return new Date(progressB?.completed_at || '').getTime() - new Date(progressA?.completed_at || '').getTime();
    });

  const handleAddNote = async () => {
    if (newNote.title && newNote.content && user) {
      await addNote(newNote.title, newNote.content, newNote.chapterId || null);
      setNewNote({ title: '', content: '', chapterId: '' });
      setShowNoteModal(false);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (editedContent && user) {
      await updateNote(noteId, editedContent);
      setEditingNote(null);
      setEditedContent('');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (user && confirm('确定要删除这条笔记吗？')) {
      await deleteNote(noteId);
    }
  };

  const startEditingNote = (note: any) => {
    setEditingNote(note.id);
    setEditedContent(note.content);
  };

  return (
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">学习记录</h1>
        
        {user ? (
          <div className="space-y-8">
            {/* Learning Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <BookOpen size={20} className="mr-2" />
                学习进度
              </h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">已完成章节</span>
                  <span className="font-medium">{completedChapters} / {totalChapters}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-right text-sm text-gray-500">
                  {Math.round(progressPercentage)}% 完成
                </div>
              </div>
              <Link
                to="/python-course"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                继续学习
              </Link>
            </div>

            {/* Completed Chapters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">已完成章节</h2>
              {completedChapterDetails.length > 0 ? (
                <ul className="space-y-4">
                  {completedChapterDetails.map((chapter) => {
                    const progress = learningProgress.find(p => p.chapter_id === chapter.id);
                    return (
                      <li key={chapter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <CheckCircle size={20} className="text-green-500 mr-3" />
                          <Link 
                            to={`/python-course/${chapter.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {chapter.order}. {chapter.title}
                          </Link>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar size={14} className="mr-1" />
                          <span>{progress?.completed_at ? new Date(progress.completed_at).toLocaleDateString() : ''}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">暂无已完成章节</p>
                  <Link
                    to="/python-course"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    开始学习
                  </Link>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">学习笔记</h2>
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  添加笔记
                </button>
              </div>
              
              {notes.length > 0 ? (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="p-4 bg-gray-50 rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium">{note.title}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditingNote(note)}
                            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {editingNote === note.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateNote(note.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              保存
                            </button>
                            <button
                              onClick={() => {
                                setEditingNote(null);
                                setEditedContent('');
                              }}
                              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 mb-2">{note.content}</p>
                      )}
                      
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar size={14} className="mr-1" />
                        <span>{new Date(note.created_at).toLocaleDateString()}</span>
                        {note.chapter_id && (
                          <span className="ml-4">
                            章节: {chapters.find(c => c.id === note.chapter_id)?.title}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">暂无学习笔记</p>
                  <button
                    onClick={() => setShowNoteModal(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    添加笔记
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-700 mb-6">请登录后查看学习记录</p>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              登录/注册
            </Link>
          </div>
        )}

        {/* Add Note Modal */}
        {showNoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">添加笔记</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="笔记标题"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">内容</label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="笔记内容"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">关联章节（可选）</label>
                  <select
                    value={newNote.chapterId}
                    onChange={(e) => setNewNote({ ...newNote, chapterId: e.target.value })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">选择章节</option>
                    {chapters.map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.order}. {chapter.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddNote}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setShowNoteModal(false);
                      setNewNote({ title: '', content: '', chapterId: '' });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningRecords;
