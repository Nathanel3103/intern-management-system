import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { tasksAPI } from '../../services/api';
import { FiClock, FiCheck, FiCalendar, FiAlertCircle, FiUser } from 'react-icons/fi';

const InternDashboard = () => {
	const { user } = useAuth();
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const loadTasks = async () => {
			setLoading(true);
			setError('');
			try {
				const data = await tasksAPI.list();
				setTasks(Array.isArray(data) ? data : []);
			} catch (err) {
				 console.error(err);
				setError('Failed to load tasks');
			} finally {
				setLoading(false);
			}
		};
		loadTasks();
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
			<header className="flex flex-col md:flex-row items-center justify-between mb-8">
				<div className="flex items-center space-x-3 mb-4 md:mb-0">
					<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
						<span className="text-white font-bold text-lg">IN</span>
					</div>
					<h1 className="text-2xl font-bold text-gray-900">
						Intern Dashboard
					</h1>
				</div>
				<div className="text-right">
					<p className="text-sm text-gray-600">Welcome</p>
					<p className="text-lg font-semibold">{user?.first_name} {user?.last_name}</p>
					<p className="text-xs text-gray-500">{user?.email}</p>
				</div>
			</header>

			<main className="space-y-6">
				<div className="bg-white rounded-2xl shadow-xl p-6">
					<h2 className="text-xl font-bold mb-2">Your Overview</h2>
					<p className="text-gray-600">This is your personalized space. Upcoming tasks and recent activity will appear here.</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white rounded-2xl shadow-xl p-6">
						<h3 className="text-lg font-semibold mb-4">Assigned Tasks</h3>
						{loading && (
							<p className="text-blue-600">Loading tasks...</p>
						)}
						{!loading && error && (
							<p className="text-red-600">{error}</p>
						)}
						{!loading && !error && tasks.length === 0 && (
							<p className="text-gray-600">No tasks assigned yet.</p>
						)}
						{!loading && !error && tasks.length > 0 && (
							<div className="space-y-4">
								{tasks.map((task) => (
									<div key={task.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<h4 className="font-semibold text-gray-900">{task.title}</h4>
													<span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${task.status === 'In Progress' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
														{task.status === 'In Progress' ? <FiClock className="h-3 w-3" /> : <FiCheck className="h-3 w-3" />}
														{task.status}
													</span>
												</div>
												<p className="text-gray-600 mb-3">{task.description || 'No description provided.'}</p>
												<div className="flex flex-wrap gap-4 text-sm text-gray-500">
													<div className="flex items-center gap-2"><FiUser className="h-4 w-4 text-gray-400" /> You</div>
													<div className="flex items-center gap-2"><FiCalendar className="h-4 w-4 text-gray-400" /> Due: {task.dueDate}</div>
													<div className="flex items-center gap-2"><FiAlertCircle className={`h-4 w-4 ${task.priority === 'High' ? 'text-red-400' : task.priority === 'Medium' ? 'text-orange-400' : 'text-gray-400'}`} /> Priority: {task.priority}</div>
												</div>
												<div className="mt-3">
													<div className="flex justify-between text-xs mb-1">
														<span>Progress</span>
														<span>{task.progress}%</span>
													</div>
													<div className="w-full bg-gray-200 rounded-full h-2">
														<div className={`h-2 rounded-full ${task.status === 'In Progress' ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${task.progress}%` }}></div>
													</div>
												</div>
											</div>
										</div>
									</div>
									))}
								</div>
							)}
						</div>
						<div className="bg-white rounded-2xl shadow-xl p-6">
							<h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
							<p className="text-gray-600">Your recent activity will show up here.</p>
						</div>
					</div>
				</main>
		</div>
	);
};

export default InternDashboard;


