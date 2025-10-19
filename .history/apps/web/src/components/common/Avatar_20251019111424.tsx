'use client';

import { useEffect, useState } from 'react';

interface AvatarProps {
  user: {
    name?: string;
    email?: string;
    avatar?: string;
  } | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export function Avatar({ user, size = 'md', className = '', onClick }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = getColorFromString(user?.email || user?.name || 'user');

  useEffect(() => {
    setImageError(false);
  }, [user?.avatar]);

  if (user?.avatar && !imageError) {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 ${className} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <img
          src={user.avatar}
          alt={user.name || user.email || 'User'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${avatarColor} flex items-center justify-center text-white font-medium flex-shrink-0 ${className} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      onClick={onClick}
      title={user?.name || user?.email}
    >
      {getInitials()}
    </div>
  );
}
