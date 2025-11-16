import Spline from '@splinetool/react-spline';

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/IKzHtP5ThSO83edK/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center justify-center bg-gradient-to-b from-black/30 to-white/0 pointer-events-none">
        <div className="max-w-3xl mx-auto text-center text-white px-6 pointer-events-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-sm">
            מנתח פיננסי אישי (PFA)
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">
            שליטה מלאה בתזרים המזומנים שלך – העלאת מסמכים, ניתוח אוטומטי וויזואליזציה ברורה.
          </p>
          <div className="mt-8">
            <button onClick={onGetStarted} className="bg-white text-blue-700 font-semibold rounded-full px-6 py-3 hover:bg-blue-50 transition">
              התחילו עכשיו
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
