import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { userService } from '@/services/userService';
import { User } from '@/types/user';
import styles from '@/styles/Detail.module.css';

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserById(userId);
      setUser(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading user details...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || 'User not found'}</div>
        <button className={styles.backButton} onClick={() => router.push('/')}>
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.detailCard}>
        <h1>User Details</h1>
        
        <div className={styles.detailRow}>
          <span className={styles.label}>ID:</span>
          <span className={styles.value}>{user.id}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.label}>Name:</span>
          <span className={styles.value}>{user.name}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{user.email}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.label}>Role:</span>
          <span className={`${styles.value} ${styles.roleBadge}`}>{user.role}</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.label}>Created At:</span>
          <span className={styles.value}>
            {new Date(user.created_at).toLocaleString()}
          </span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.label}>Updated At:</span>
          <span className={styles.value}>
            {new Date(user.updated_at).toLocaleString()}
          </span>
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.backButton}
            onClick={() => router.push('/')}
          >
            Back to List
          </button>
          <button
            className={styles.editButton}
            onClick={() => router.push(`/users/${user.id}/edit`)}
          >
            Edit User
          </button>
        </div>
      </div>
    </div>
  );
}
