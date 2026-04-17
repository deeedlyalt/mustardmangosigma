import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chapters, getChapter, ChapterId } from '@/data/chapters';
import QuizComponent from '@/components/QuizComponent';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';

const QuizPage = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const isMixed = chapterId === 'mixed';

 const questions = useMemo(() => {
  if (isMixed) {
    const all = chapters.flatMap(c => c.questions);
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }

  const chapter = getChapter(chapterId as ChapterId);
  if (!chapter) return [];

  return [...chapter.questions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10); // 👈 här är fixen

}, [chapterId, isMixed]);

  const chapter = !isMixed ? getChapter(chapterId as ChapterId) : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <PageHeader
          title={isMixed ? 'Snabbquiz' : `Quiz – ${chapter?.title || ''}`}
          subtitle={isMixed ? '10 slumpade frågor från alla kapitel' : undefined}
          icon={isMixed ? '🎲' : chapter?.icon}
        />
        {questions.length > 0 ? (
          <QuizComponent
            questions={questions}
            chapterId={isMixed ? 'mixed' : (chapterId as ChapterId)}
            onComplete={() => navigate(isMixed ? '/' : `/chapter/${chapterId}`)}
          />
        ) : (
          <p className="text-muted-foreground text-center py-8">Inga frågor hittades.</p>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default QuizPage;
