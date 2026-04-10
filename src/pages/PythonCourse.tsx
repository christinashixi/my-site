import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Copy, Check, BookOpen } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Chapter } from '../types';

const PythonCourse: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [copied, setCopied] = useState(false);
  
  const {
    fetchChapters,
    chapters,
    fetchLearningProgress,
    learningProgress,
    updateLearningProgress,
    user
  } = useStore();

  useEffect(() => {
    fetchChapters();
    if (user) {
      fetchLearningProgress();
    }
  }, [fetchChapters, fetchLearningProgress, user]);

  useEffect(() => {
    if (chapterId && chapters.length > 0) {
      const chapter = chapters.find(c => c.id === chapterId);
      setSelectedChapter(chapter || null);
    } else if (chapters.length > 0) {
      // Default to first chapter if no chapterId is provided
      setSelectedChapter(chapters[0]);
    }
  }, [chapterId, chapters]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkComplete = async (chapterId: string) => {
    if (user) {
      await updateLearningProgress(chapterId, true);
    }
  };

  const isChapterCompleted = (chapterId: string) => {
    return learningProgress.some(p => p.chapter_id === chapterId && p.completed);
  };

  // Sample code examples for each chapter
  const codeExamples: Record<string, string> = {
    'chapter-1': `# Python简介
print("Hello, Python!")
`,
    'chapter-2': `# Python环境搭建
# 检查Python版本
import sys
print(sys.version)`,
    'chapter-3': `# Python基础语法
# 变量和数据类型
name = "Python"
age = 30
is_cool = True

# 打印变量
print(f"{name} is {age} years old and it's {is_cool} that it's cool!")`,
    'chapter-4': `# 控制流程
# 条件语句
age = 18
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# 循环语句
for i in range(5):
    print(i)`,
    'chapter-5': `# 函数
def greet(name):
    """问候函数"""
    return f"Hello, {name}!"

# 调用函数
print(greet("Python"))`,
    'chapter-6': `# 数据结构
# 列表
fruits = ["apple", "banana", "cherry"]

# 字典
person = {"name": "John", "age": 30}

# 集合
colors = {"red", "green", "blue"}`,
    'chapter-7': `# 文件操作
# 写入文件
with open("example.txt", "w") as f:
    f.write("Hello, File!")

# 读取文件
with open("example.txt", "r") as f:
    content = f.read()
    print(content)`,
    'chapter-8': `# 异常处理
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
finally:
    print("This will always execute")`
  };

  // Sample exercise questions for each chapter
  const exercises: Record<string, string> = {
    'chapter-1': "1. Python的创始人是谁？\n2. Python的主要特点有哪些？\n3. Python的应用领域有哪些？",
    'chapter-2': "1. 如何检查Python的版本？\n2. 如何安装Python？\n3. 什么是虚拟环境？如何创建和激活虚拟环境？",
    'chapter-3': "1. Python的基本数据类型有哪些？\n2. 如何将一个整数转换为字符串？\n3. 如何获取用户输入？",
    'chapter-4': "1. 写出一个判断奇偶数的条件语句。\n2. 写出一个计算1到100之和的循环。\n3. 什么是嵌套循环？",
    'chapter-5': "1. 如何定义一个函数？\n2. 函数的参数有哪些类型？\n3. 如何返回多个值？",
    'chapter-6': "1. 列表和元组的区别是什么？\n2. 如何向字典中添加新的键值对？\n3. 如何遍历集合中的元素？",
    'chapter-7': "1. 如何打开一个文件进行读取？\n2. 如何处理文件不存在的情况？\n3. 为什么要使用with语句操作文件？",
    'chapter-8': "1. 什么是异常？\n2. 如何捕获特定类型的异常？\n3. 如何自定义异常？"
  };

  return (
    <div className="pt-20 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Python基础课程</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Course Directory */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen size={20} className="mr-2" />
                课程目录
              </h2>
              <ul className="space-y-2">
                {chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <Link
                      to={`/python-course/${chapter.id}`}
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        selectedChapter?.id === chapter.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {isChapterCompleted(chapter.id) && (
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                      )}
                      <span>{chapter.order}. {chapter.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chapter Content */}
          <div className="md:w-3/4">
            {selectedChapter ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    {selectedChapter.order}. {selectedChapter.title}
                  </h2>
                  {user && !isChapterCompleted(selectedChapter.id) && (
                    <button
                      onClick={() => handleMarkComplete(selectedChapter.id)}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      标记为已完成
                    </button>
                  )}
                  {user && isChapterCompleted(selectedChapter.id) && (
                    <div className="flex items-center text-green-500">
                      <CheckCircle size={16} className="mr-2" />
                      已完成
                    </div>
                  )}
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-4">章节介绍</h3>
                  <p className="text-gray-700">{selectedChapter.description}</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-4">代码示例</h3>
                  <div className="relative bg-gray-900 rounded-md p-4">
                    <pre className="text-gray-100 overflow-x-auto">
                      <code>{codeExamples[selectedChapter.id] || ''}</code>
                    </pre>
                    <button
                      onClick={() => handleCopyCode(codeExamples[selectedChapter.id] || '')}
                      className="absolute top-2 right-2 p-2 bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4">练习题</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <pre className="text-gray-700 whitespace-pre-line">
                      {exercises[selectedChapter.id] || '暂无练习题'}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500">加载课程内容中...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonCourse;
