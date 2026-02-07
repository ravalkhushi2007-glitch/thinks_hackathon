import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, BookOpen, Briefcase, TrendingUp, Edit3, Award, Star, DollarSign, ChevronRight } from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';

const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [loadingRec, setLoadingRec] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5001/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(data);
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleAnalyze = async () => {
        setLoadingRec(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5001/api/recommend', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecommendation(data);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setLoadingRec(false);
        }
    };

    const handleProfileUpdate = (updatedUser) => {
        setUser(updatedUser);
        setRecommendation(null); // Force re-analysis to get updated domain stats
    };

    if (!user) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                            <User className="h-12 w-12" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                                <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/20">
                                    {user.profile?.domain || 'General'}
                                </span>
                            </div>
                            <p className="text-indigo-100 mt-1">{user.profile?.branch || 'Branch N/A'} • Year {user.profile?.year || 'N/A'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition border border-white/30"
                    >
                        <Edit3 size={18} />
                        <span>Edit Profile</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Stats Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Award className="text-indigo-600" />
                            Academic Profile
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">GPA</span>
                                <span className="font-bold text-gray-900 text-lg">{user.profile?.gpa || 'N/A'}</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Technical Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.profile?.skills?.length > 0 ? (
                                        user.profile.skills.map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic text-sm">No skills listed</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.profile?.interests?.length > 0 ? (
                                        user.profile.interests.map((interest, index) => (
                                            <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full font-medium">
                                                {interest}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic text-sm">No interests listed</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white text-center">
                        <Star className="h-10 w-10 mx-auto mb-3 opacity-90" />
                        <h3 className="text-lg font-semibold">Ready to get placed?</h3>
                        <p className="text-indigo-100 text-sm mb-4">Analyze your profile to find gaps and get recommendations.</p>
                        <button
                            onClick={handleAnalyze}
                            disabled={loadingRec}
                            className="w-full bg-white text-indigo-600 py-3 rounded-lg font-bold hover:bg-indigo-50 transition shadow-lg disabled:opacity-75"
                        >
                            {loadingRec ? 'Analyzing...' : 'Analyze Now'}
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2">
                    {recommendation ? (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <TrendingUp className="text-green-600" />
                                    Placement Probability
                                </h2>
                                <div className="flex items-center gap-6">
                                    <div className="relative h-24 w-24 flex items-center justify-center">
                                        <svg className="h-full w-full transform -rotate-90">
                                            <circle cx="48" cy="48" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                                            <circle cx="48" cy="48" r="36" stroke={recommendation.placementProbability > 70 ? "#10b981" : "#f59e0b"} strokeWidth="8" fill="none" strokeDasharray="226" strokeDashoffset={226 - (226 * recommendation.placementProbability) / 100} className="transition-all duration-1000 ease-out" />
                                        </svg>
                                        <span className="absolute text-2xl font-bold text-gray-800">{recommendation.placementProbability}%</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">Analysis Summary</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {recommendation.placementProbability > 80 ? "Excellent profile! You are well-positioned for top-tier companies." :
                                                recommendation.placementProbability > 50 ? "Good potential, but some key skills are missing." :
                                                    "You need to focus on skill development to improve placement chances."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Briefcase className="text-orange-500" />
                                    Skill Gaps
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {recommendation.recommendedSkills?.map((skill, index) => (
                                        <span key={index} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg flex items-center gap-2 border border-orange-100">
                                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                            {skill.toUpperCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <BookOpen className="text-blue-600" />
                                    Recommended Courses
                                </h2>
                                <ul className="space-y-3">
                                    {recommendation.suggestedCourses?.map((course, index) => (
                                        <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-200">
                                            <div className="bg-blue-100 p-2 rounded text-blue-600 mt-1">
                                                <BookOpen size={16} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{course}</h4>
                                                <p className="text-xs text-gray-500 mt-1">Recommended to bridge your skill gap</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center">
                            <div className="bg-indigo-50 p-6 rounded-full mb-4">
                                <TrendingUp className="h-12 w-12 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-800">No Analysis Yet</h3>
                            <p className="text-gray-500 mt-2 max-w-sm">Click the "Analyze Now" button to get personalized career insights based on your profile.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Hiring Companies Section */}
            {recommendation?.hiringCompanies?.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 pb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                            <Briefcase size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Top Hiring Companies for {user.profile?.domain || 'Your Field'}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendation.hiringCompanies.map((company, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10">{company.name}</h3>

                                <div className="flex items-center gap-2 text-green-600 font-semibold mb-4 relative z-10">
                                    <DollarSign size={18} />
                                    <span>{company.avg_salary}</span>
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Required Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {company.skills.map((skill, sIndex) => (
                                            <span key={sIndex} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div
                                    onClick={() => company.url && window.open(company.url, '_blank')}
                                    className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center group-hover:text-orange-600 transition-colors cursor-pointer"
                                >
                                    <span className="text-sm font-medium">View Open Roles</span>
                                    <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <EditProfileModal
                    user={user}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={handleProfileUpdate}
                />
            )}
        </div>
    );
};

export default StudentDashboard;
