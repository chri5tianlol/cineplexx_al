const { Movie, Showtime, Hall, Cinema } = require('../models');

exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.findAll({
            include: [{
                model: Showtime,
                as: 'showtimes',
                include: [{
                    model: Hall,
                    include: [Cinema]
                }]
            }]
        });

        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findByPk(id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper: Ensure only one movie is "trending_hero"
const ensureUniqueTrending = async (targetId, categories) => {
    if (!Array.isArray(categories)) return;

    if (categories.includes('trending_hero')) {
        const allMovies = await Movie.findAll();
        for (const m of allMovies) {
            // Skip current
            if (m.id == targetId) continue;

            const cats = m.category || [];
            if (Array.isArray(cats) && cats.includes('trending_hero')) {
                const newCats = cats.filter(c => c !== 'trending_hero');
                m.setDataValue('category', JSON.stringify(newCats));
                await m.save();
                console.log(`Removed trending_hero from movie ${m.title}`);
            }
        }
    }
};

exports.createMovie = async (req, res) => {
    try {
        console.log('Create Body:', req.body);
        await ensureUniqueTrending(null, req.body.category);

        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Update ${id} Body:`, req.body);

        const movie = await Movie.findByPk(id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });

        // Handle Unique Constraint
        if (req.body.category) {
            await ensureUniqueTrending(id, req.body.category);
        }

        // Explicitly handle category to avoid hook issues
        if (req.body.category) {
            movie.setDataValue('category', JSON.stringify(req.body.category));
        }

        // Update other fields
        const { category, ...otherFields } = req.body;
        await movie.update(otherFields);

        if (req.body.category) await movie.save();

        await movie.reload();
        return res.status(200).json(movie);
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findByPk(id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });

        await movie.destroy();
        res.json({ message: 'Movie deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
