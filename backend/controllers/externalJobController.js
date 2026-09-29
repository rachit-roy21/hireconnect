exports.getExternalJobs = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const apiUrl = process.env.EXTERNAL_JOBS_API_URL || 'https://remotive.com/api/remote-jobs';

    const params = new URLSearchParams();
    params.set('limit', '20');
    if (search) params.set('search', search);
    if (category) params.set('category', category);

    const response = await fetch(`${apiUrl}?${params.toString()}`);
    if (!response.ok) {
      return res.status(502).json({
        success: false,
        jobs: [],
        message: 'External jobs provider is currently unavailable.'
      });
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.jobs)) {
      return res.status(502).json({
        success: false,
        jobs: [],
        message: 'External jobs provider returned an unexpected response.'
      });
    }

    const normalizedJobs = data.jobs.slice(0, 20).map((item) => ({
      id: item.id,
      title: item.title,
      companyName: item.company_name,
      companyLogo: item.company_logo || '',
      location: item.candidate_required_location || 'Remote',
      employmentType: item.job_type || 'Full-Time',
      salary: item.salary || 'Not disclosed',
      url: item.url,
      category: item.category || 'Software Development',
      publishedAt: item.publication_date,
      isExternal: true
    }));

    res.status(200).json({
      success: true,
      count: normalizedJobs.length,
      jobs: normalizedJobs,
      source: 'external'
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      jobs: [],
      message: 'Unable to load external jobs right now.'
    });
  }
};
