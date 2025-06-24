import React, { useEffect, useState } from 'react';
import api from '../lib/axios';

const About: React.FC = () => {

    const [health, setHealth] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await api.get('/health');
                console.log(response.data);
                setHealth(response.data.message === 'API is running');
            } catch (error) {   
                console.error('Health check failed', error);
                setHealth(false);
            }
            finally {
                setLoading(false);
            }
        };
        checkHealth();
    }, []);


    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {health ? (
                        <h1>Server is up and running</h1>
                    ) : (
                        <h1>Server is down</h1>
                    )}
                </div>
            )}
        </div>
    );
};

export default About;