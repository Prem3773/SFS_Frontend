import React, { useState } from 'react';
import { FaHome } from 'react-icons/fa';

const FeedbackHostel = () => {
  const [feedback, setFeedback] = useState({
    cleanliness: '',
    facilities: '',
    foodQuality: '',
    maintenance: '',
    additionalComments: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to submit hostel feedback.');
        setSubmitting(false);
        return;
      }

      const response = await fetch('https://feedback-system-1-0sp1.onrender.com/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: 'hostel',
          responses: {
            cleanliness: feedback.cleanliness,
            facilities: feedback.facilities,
            foodQuality: feedback.foodQuality,
            maintenance: feedback.maintenance,
            additionalComments: feedback.additionalComments
          }
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit hostel feedback.');
      }

      alert('Feedback submitted successfully.');
      setFeedback({
        cleanliness: '',
        facilities: '',
        foodQuality: '',
        maintenance: '',
        additionalComments: ''
      });
    } catch (error) {
      console.error('Error submitting hostel feedback:', error);
      alert(error.message || 'Error submitting feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-800 py-8 sm:py-10 px-4'>
      <div className='w-full max-w-4xl mx-auto bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 sm:p-6'>
        <div className='flex items-center mb-6'>
          <FaHome className='text-3xl text-blue-500 mr-3' />
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white'>Hostel Feedback</h1>
        </div>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>
          Provide detailed feedback on hostel facilities. Your input helps improve living conditions and will be analyzed by AI.
        </p>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Cleanliness
            </label>
            <textarea
              name='cleanliness'
              value={feedback.cleanliness}
              onChange={handleChange}
              placeholder='Describe the cleanliness of common areas, rooms, bathrooms, etc.'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white'
              rows='3'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Facilities
            </label>
            <textarea
              name='facilities'
              value={feedback.facilities}
              onChange={handleChange}
              placeholder='Comment on availability and quality of facilities like WiFi, laundry, study areas, etc.'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white'
              rows='3'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Food Quality
            </label>
            <textarea
              name='foodQuality'
              value={feedback.foodQuality}
              onChange={handleChange}
              placeholder='Share your thoughts on mess food, variety, hygiene, and nutritional value.'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white'
              rows='3'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Maintenance
            </label>
            <textarea
              name='maintenance'
              value={feedback.maintenance}
              onChange={handleChange}
              placeholder='Report any maintenance issues, repairs needed, or suggestions for upkeep.'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white'
              rows='3'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Additional Comments
            </label>
            <textarea
              name='additionalComments'
              value={feedback.additionalComments}
              onChange={handleChange}
              placeholder='Any other feedback or suggestions for hostel improvements.'
              className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white'
              rows='3'
            />
          </div>
          <button
            type='submit'
            disabled={submitting}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackHostel;
