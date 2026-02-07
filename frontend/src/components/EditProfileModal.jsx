import { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        gpa: user.profile?.gpa || '',
        branch: user.profile?.branch || '',
        year: user.profile?.year || '',
        domain: user.profile?.domain || '',
        skills: user.profile?.skills?.join(', ') || '',
        interests: user.profile?.interests?.join(', ') || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const payload = {
                name: formData.name,
                profile: {
                    gpa: parseFloat(formData.gpa),
                    branch: formData.branch,
                    year: parseInt(formData.year),
                    domain: formData.domain,
                    skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                    interests: formData.interests.split(',').map(s => s.trim()).filter(s => s)
                }
            };

            const { data } = await axios.put('http://localhost:5001/api/auth/profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local storage
            const updatedUser = { ...user, ...data };
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Should ideally refetch but this updates local cache

            onUpdate(data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden max-h-[95vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold">Edit Profile</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-red-600 bg-red-50 p-2 rounded">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Branch</label>
                            <select name="branch" value={formData.branch} onChange={handleChange} className="mt-1 block w-full border rounded p-2 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">Select Branch</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="IT">IT</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Year</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} min="1" max="4" className="mt-1 block w-full border rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Target Domain</label>
                        <select name="domain" value={formData.domain} onChange={handleChange} className="mt-1 block w-full border rounded p-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="General">General/Other</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Full Stack Development">Full Stack Development</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="Cyber Security">Cyber Security</option>
                            <option value="App Development">App Development</option>
                            <option value="iOS Development">iOS Development</option>
                            <option value="Android Development">Android Development</option>
                            <option value="Game Development">Game Development</option>
                            <option value="Cloud Computing">Cloud Computing</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Data Engineering">Data Engineering</option>
                            <option value="DevOps">DevOps</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Blockchain">Blockchain</option>
                            <option value="Embedded Systems/IoT">Embedded Systems/IoT</option>
                            <option value="Software Testing/QA">Software Testing/QA</option>
                            <option value="AR/VR Development">AR/VR Development</option>
                            <option value="Site Reliability Engineering (SRE)">Site Reliability Engineering (SRE)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">GPA (CGPA)</label>
                        <input type="number" name="gpa" value={formData.gpa} onChange={handleChange} step="0.01" min="0" max="10" className="mt-1 block w-full border rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Skills (Comma separated)</label>
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Java, Python, React..." className="mt-1 block w-full border rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Interests (Comma separated)</label>
                        <input type="text" name="interests" value={formData.interests} onChange={handleChange} placeholder="AI, Web Dev, Robotics..." className="mt-1 block w-full border rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
