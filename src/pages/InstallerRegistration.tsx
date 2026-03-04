import React, { useState } from 'react';
import './InstallerRegistration.css';
import api from "@/lib/api";

const InstallerRegistration: React.FC = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        other_phone: '',
        address: ''
    });
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!previewPhoto) {
            alert('Please upload a live photo');
            return;
        }

        try {
            const response = await api.post('/api/installers/register', {
                ...formData,
                photo_url: previewPhoto // In a production app, we should upload to S3/Cloudinary and send the URL
            });

            if (response.status === 201) {
                alert('Registration successful! We will review your application.');
                setFormData({ full_name: '', phone: '', other_phone: '', address: '' });
                setPreviewPhoto(null);
            }
        } catch (error: any) {
            console.error('Error submitting form:', error);
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            alert(message);
        }
    };

    return (
        <div className="registration-wrapper">
            <div className="registration-container">
                <div className="form-header">
                    <h1>Join Our Installer Network</h1>
                    <p>Register today and start receiving verified installation jobs in your area.</p>
                </div>

                <form className="installer-form" onSubmit={handleSubmit}>
                    {/* Live Photo */}
                    <div className="photo-section">
                        <label htmlFor="livePhoto" className="photo-label">
                            <div className="photo-circle" style={previewPhoto ? { backgroundImage: `url(${previewPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center', border: 'none' } : {}}>
                                {!previewPhoto && <span>Upload Live Photo</span>}
                            </div>
                        </label>
                        <input type="file" id="livePhoto" accept="image/*" capture="environment" hidden onChange={handlePhotoChange} />
                    </div>

                    {/* Full Name */}
                    <div className="input-group">
                        <input type="text" id="full_name" value={formData.full_name} onChange={handleInputChange} required />
                        <label htmlFor="full_name">Full Name</label>
                    </div>

                    {/* Phone Number */}
                    <div className="input-group">
                        <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} required />
                        <label htmlFor="phone">Phone Number</label>
                    </div>

                    {/* Other Number (Optional) */}
                    <div className="input-group">
                        <input type="tel" id="other_phone" value={formData.other_phone} onChange={handleInputChange} />
                        <label htmlFor="other_phone">Other Number (Optional)</label>
                    </div>

                    {/* Home Address */}
                    <div className="input-group">
                        <textarea id="address" rows={3} value={formData.address} onChange={handleInputChange} required></textarea>
                        <label htmlFor="address">Home Address</label>
                    </div>

                    <button type="submit" className="submit-btn" disabled={!previewPhoto}>
                        Register Installer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InstallerRegistration;
