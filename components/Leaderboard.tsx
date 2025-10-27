import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config.ts';
import { CrownIcon } from './icons.tsx';
import { Topic } from '../types.ts';

// Date helpers
const getTodayId = () => new Date().toISOString().split('T')[0];
const getWeekId = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff)).toISOString().split('T')[0];
};

const LeaderCard = ({ title, user, score, icon }) => {
    if (!user) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center h-full">
                <p className="text-gray-500 dark:text-gray-400">{title}</p>
                <p className="mt-2 font-semibold text-gray-700 dark:text-gray-200">אין עדיין נתונים</p>
            </div>
        );
    }
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center text-center h-full">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="font-bold text-indigo-500">{title}</p>
            <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{user.username}</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">{score.toLocaleString()} נקודות</p>
        </div>
    );
};

const TopicLeaderCard = ({ topic, user, score }) => {
    if (!user) return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center opacity-60">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm truncate">{topic}</h4>
            <p className="font-bold text-lg text-gray-400 dark:text-gray-500 mt-1">-</p>
            <p className="text-indigo-500/50 text-sm font-semibold">0 נק'</p>
        </div>
    );
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm truncate">{topic}</h4>
            <p className="font-bold text-lg text-gray-900 dark:text-white mt-1 truncate">{user.username}</p>
            <p className="text-indigo-500 text-sm font-semibold">{score.toLocaleString()} נק'</p>
        </div>
    );
};


export default function Leaderboard({ currentUser }) {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('score', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map(doc => ({
            uid: doc.id,
            username: doc.id, // The doc id is the username
            ...doc.data()
        }));
        setAllUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching all users for leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const { dailyLeader, weeklyLeader, topicLeaders } = useMemo(() => {
      if (loading || allUsers.length === 0) {
          return { dailyLeader: null, weeklyLeader: null, topicLeaders: {} };
      }
      
      const todayId = getTodayId();
      const weekId = getWeekId();

      let dailyLeader = null;
      let maxDailyScore = -1;

      let weeklyLeader = null;
      let maxWeeklyScore = -1;

      const leadersByTopic = {};
      const topicMaxScores = {};

      allUsers.forEach(user => {
          // Daily leader
          if (user.dailyStats?.periodId === todayId && user.dailyStats.score > maxDailyScore) {
              maxDailyScore = user.dailyStats.score;
              dailyLeader = { user, score: user.dailyStats.score };
          }
          
          // Weekly leader
          if (user.weeklyStats?.periodId === weekId && user.weeklyStats.score > maxWeeklyScore) {
              maxWeeklyScore = user.weeklyStats.score;
              weeklyLeader = { user, score: user.weeklyStats.score };
          }

          // Topic leaders (weekly)
          if (user.weeklyStats?.periodId === weekId && user.weeklyStats.scoresBySubject) {
              Object.entries(user.weeklyStats.scoresBySubject).forEach(([topic, score]) => {
                  if (!topicMaxScores[topic] || score > topicMaxScores[topic]) {
                      topicMaxScores[topic] = score;
                      leadersByTopic[topic] = { user, score };
                  }
              });
          }
      });
      
      return { dailyLeader, weeklyLeader, topicLeaders: leadersByTopic };
  }, [allUsers, loading]);


  const getRankColor = (rank) => {
    if (rank === 0) return 'bg-amber-400 text-amber-900';
    if (rank === 1) return 'bg-slate-300 text-slate-800';
    if (rank === 2) return 'bg-orange-400 text-orange-900';
    return 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200';
  };

  if (loading) {
      return <div className="text-center p-10">טוען דירוגים...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">לוח המובילים</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          מי הכי חד היום, השבוע, ובכל הזמנים?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LeaderCard title="המוביל/ה היומי/ת" user={dailyLeader?.user} score={dailyLeader?.score} icon="☀️" />
        <LeaderCard title="המוביל/ה השבועי/ת" user={weeklyLeader?.user} score={weeklyLeader?.score} icon="🗓️" />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">מובילי השבוע לפי נושא</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.values(Topic).map(topic => (
                <TopicLeaderCard 
                    key={topic}
                    topic={topic} 
                    user={topicLeaders[topic]?.user} 
                    score={topicLeaders[topic]?.score} 
                />
            ))}
        </div>
      </div>
      
      <div>
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">דירוג כללי (כל הזמנים)</h3>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg">
             <ul className="space-y-4">
                {allUsers.slice(0, 20).map((user, index) => { // Show top 20
                  const isCurrentUser = user.username === currentUser.username;
                  return (
                    <li
                      key={user.uid}
                      className={`flex items-center p-3 sm:p-4 rounded-lg transition-all ${isCurrentUser ? 'bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-500' : 'bg-gray-50 dark:bg-gray-700/50'}`}
                    >
                      <div className="flex items-center gap-4 w-12 sm:w-16">
                        <span className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${getRankColor(index)}`}>
                            {index + 1}
                        </span>
                        {index === 0 && <CrownIcon className="h-6 w-6 text-amber-500 hidden sm:block" />}
                      </div>
                      
                      <div className="flex-grow">
                          <p className={`font-bold text-md sm:text-lg ${isCurrentUser ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-100'}`}>
                            {user.username}
                          </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-indigo-500 dark:text-indigo-400 text-md sm:text-lg">{user.score.toLocaleString()} נק'</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.completedExercises} תרגילים</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
          </div>
      </div>
    </div>
  );
}
