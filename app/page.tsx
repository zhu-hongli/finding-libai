import PoemEvaluator from './components/PoemEvaluator';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <PoemEvaluator />
    </div>
  );
}
