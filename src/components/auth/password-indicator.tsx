export default function PasswordStrength({ password }: { password: string }) {
  const getStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength(password);
  const getColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getLabel = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className='mt-2'>
      <div className='flex items-center justify-between text-xs mb-1'>
        <span className='text-slate-500'>Password strength</span>
        <span
          className={`font-medium ${
            strength <= 2
              ? 'text-red-500'
              : strength <= 3
              ? 'text-yellow-500'
              : 'text-green-500'
          }`}
        >
          {getLabel()}
        </span>
      </div>
      <div className='w-full bg-slate-200 rounded-full h-1'>
        <div
          className={`h-1 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}
