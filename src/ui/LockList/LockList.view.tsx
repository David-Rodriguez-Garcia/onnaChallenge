import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocksList } from "./../../core/infrastructure/getLocksList.js"
import { useLockContext } from '../_context/LockContext'; // Import the context hook
import styles from './_styles/LockList.module.css'; // Assume the CSS module is in the same directory

interface Lock {
    lockId: number;
    date: number;
    specialValue: number;
    electricQuantity: number;
    lockAlias: string;
    lockData: string;
    hasGateway: number;
    wirelessKeypadFeatureValue: number;
    lockMac: string;
    lockName: string;
    timezoneRawOffset: number;
}

export const LockListView: React.FC = () => {
    const [locks, setLocks] = useState<Lock[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { setLockId } = useLockContext(); // Use context to set lock ID
    const navigate = useNavigate(); // useHistory for navigation

    useEffect(() => {
        const fetchLocks = async () => {
            try {
                const response = await getLocksList();
                setLocks(response);
                setIsLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                    setIsLoading(false);
                }
            }
        };

        fetchLocks();
    }, []);

    const handleLockClick = (lockId: number) => {
        setLockId(lockId); // Update context with the new lock ID
        navigate('/home'); // Navigate to HomeScreen
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Locks List</h1>
            {locks.map(lock => (
                <button key={lock.lockId} className={styles.lockButton} onClick={() => handleLockClick(lock.lockId)}>
                    <h2>{lock.lockAlias} (ID: {lock.lockId})</h2>
                    <div className={styles.lockDetails}>
                        <p>Electric Quantity: {lock.electricQuantity}%</p>
                        <p>Lock Data: {lock.lockData.substring(0, 50)}...</p>
                    </div>
                </button>
            ))}
        </div>
    );
};
