import React, { memo, useState } from 'react';
import type { TUser } from 'librechat-data-provider';
import type { IconProps } from '~/common';
import MessageEndpointIcon from './MessageEndpointIcon';
import { useAuthContext } from '~/hooks/AuthContext';
import useAvatar from '~/hooks/Messages/useAvatar';
import useLocalize from '~/hooks/useLocalize';
import { UserIcon } from '~/components/svg';
import { cn } from '~/utils';

// favicon 이미지 import
import faviconUrl from '../../../public/assets/favicon.ico';

type UserAvatarProps = {
  size: number;
  user?: TUser;
  avatarSrc: string;
  username: string;
  className?: string;
};

const UserAvatar = memo(({ size, user, avatarSrc, username, className }: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderDefaultAvatar = () => (
    <div
      style={{
        width: '28px',
        height: '28px',
      }}
      className="relative flex items-center justify-center"
    >
      <img 
        src={faviconUrl} 
        alt="User icon" 
        width="100%" 
        height="100%" 
        style={{ objectFit: 'contain' }} 
      />
    </div>
  );

  return (
    <div
      title={username}
      style={{
        width: size,
        height: size,
      }}
      className={cn('relative flex items-center justify-center', className ?? '')}
    >
      {(!(user?.avatar ?? '') && (!(user?.username ?? '') || user?.username.trim() === '')) ||
      imageError ? (
          renderDefaultAvatar()
        ) : (
          <img
            src={(user?.avatar ?? '') || avatarSrc}
            alt="avatar"
            width="100%" 
            height="100%"
            style={{ objectFit: 'contain' }}
            onError={handleImageError}
          />
        )}
    </div>
  );
});

UserAvatar.displayName = 'UserAvatar';

const Icon: React.FC<IconProps> = memo((props) => {
  const { user } = useAuthContext();
  const { size = 30, isCreatedByUser } = props;

  const avatarSrc = useAvatar(user);
  const localize = useLocalize();

  if (isCreatedByUser) {
    const username = user?.name ?? user?.username ?? localize('com_nav_user');
    return (
      <UserAvatar
        size={size}
        user={user}
        avatarSrc={avatarSrc}
        username={username}
        className={props.className}
      />
    );
  }
  return <MessageEndpointIcon {...props} />;
});

Icon.displayName = 'Icon';

export default Icon;
