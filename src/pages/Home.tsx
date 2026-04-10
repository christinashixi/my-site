import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, ArrowRight, User, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';

const Home: React.FC = () => {
  const { fetchChapters, chapters, notes } = useStore();

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  // Get latest notes (limit to 3)
  const latestNotes = notes.slice(0, 3);

  return (
    <div className="pt-20 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">欢迎来到个人学习主页</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            记录学习点滴，分享技术知识，一起成长
          </p>
          <Link
            to="/python-course"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition-colors"
          >
            开始学习 Python
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </section>

      {/* Python Course Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Python基础课程</h2>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="md:w-1/3 flex justify-center">
                <Book size={120} className="text-blue-600" />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-semibold mb-4">Python基础入门课程</h3>
                <p className="text-gray-700 mb-6">
                  本课程涵盖Python基础知识，从环境搭建到高级特性，帮助你快速掌握Python编程技能。
                  课程包含详细的讲解、代码示例和练习题，适合Python初学者和希望复习基础的开发者。
                </p>
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">课程章节：</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {chapters.slice(0, 4).map((chapter) => (
                      <li key={chapter.id}>{chapter.title}</li>
                    ))}
                    {chapters.length > 4 && <li>...</li>}
                  </ul>
                </div>
                <Link
                  to="/python-course"
                  className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  查看课程
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">关于我</h2>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <User size={48} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">个人简介</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              我是一名热爱编程和技术分享的开发者，专注于Python、前端开发等领域。
              本网站记录了我的学习点滴和技术分享，希望能够帮助到更多的学习者。
              如果你对Python编程感兴趣，或者想了解更多技术知识，欢迎一起交流学习。
            </p>
            <p className="text-gray-700 leading-relaxed">
              网站持续更新中，敬请关注！
            </p>
          </div>
        </div>
      </section>

      {/* Latest Notes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">最新学习记录</h2>
          {latestNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNotes.map((note) => (
                <div key={note.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Calendar size={14} className="mr-1" />
                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {note.content}
                  </p>
                  <Link
                    to="/learning-records"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    查看更多
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无学习记录</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
