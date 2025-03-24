
import type { Player } from '@/types'
import type { User } from 'texas-poker-core/types/Player';

import { useEffect, useState } from 'react';

import { getUser } from '@/service';

/** 获取自己用户信息 */
export function useMyUser() {
  const [user, setUser] = useState<User>();

  const fetchData = async () => {
    const userInfo = await getUser();

    setUser(userInfo)
  }

  useEffect(() => {
    fetchData();
  }, [])

  return { user };
}
