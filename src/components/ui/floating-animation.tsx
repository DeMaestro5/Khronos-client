export default function FloatingOrbs() {
  return (
    <>
      {/* Animated background orbs */}
      <div className='absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-float-slow' />
      <div className='absolute top-40 right-16 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-float-medium' />
      <div className='absolute bottom-32 left-12 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl animate-float-fast' />
      <div className='absolute bottom-20 right-32 w-28 h-28 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-float-slow' />
    </>
  );
}
