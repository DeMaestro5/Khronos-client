export default function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getStrength();
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-emerald-500',
  ];
  const messages = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];

  return (
    <div className='mt-2'>
      <div className='flex gap-1 h-1'>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${
              i < strength ? colors[strength - 1] : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      {password && (
        <p
          className={`text-xs mt-1 ${
            strength <= 2
              ? 'text-red-500'
              : strength === 3
              ? 'text-yellow-500'
              : 'text-green-500'
          }`}
        >
          {messages[strength - 1]}
        </p>
      )}
    </div>
  );
}
