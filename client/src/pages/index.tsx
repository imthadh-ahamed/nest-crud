import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserContext } from '@/context/UserContext';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const { users, loading, error, fetchUsers, deleteUser } = useUserContext();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteUser(id);
        alert('User deleted successfully');
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>User Management System</h1>
        <button
          className={styles.createButton}
          onClick={() => router.push('/users/create')}
        >
          + Create New User
        </button>
      </header>

      <main className={styles.main}>
        {loading && <div className={styles.loading}>Loading users...</div>}
        
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && users.length === 0 && (
          <div className={styles.empty}>
            <p>No users found. Create your first user!</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={styles.roleBadge}>{user.role}</span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      <button
                        className={styles.viewButton}
                        onClick={() => router.push(`/users/${user.id}`)}
                      >
                        View
                      </button>
                      <button
                        className={styles.editButton}
                        onClick={() => router.push(`/users/${user.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(user.id, user.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
