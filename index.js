import got from 'got'
import crypto from 'crypto'

export const sourceNodes = async ({ boundActionCreators }, options ) => {
    const { createNode } = boundActionCreators
    
    const client = new Trakttv(options)

    try {

        const movies = await client.getWatchedMovies()

        if (movies) {

            movies.forEach(movie => {
                createNode(Object.assign(movie, {
                    id: `trakt-${movie.movie.ids.trakt}`,
                    parent: '__SOURCE__',
                    children: [],
                    internal: {
                        type: 'TrakttvWatchedMovies',
                        contentDigest: digest(movie),
                    }
                }))
            })

        }

        const shows = await client.getWatchedShows()

        if (shows) {

            shows.forEach(show => {
                createNode(Object.assign(show, {
                    id: `trakt-${show.show.ids.trakt}`,
                    parent: '__SOURCE__',
                    children: [],
                    internal: {
                        type: 'TrakttvWatchedShows',
                        contentDigest: digest(show),
                    }
                }))
            })

        }

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const digest = resource => {
    return crypto
        .createHash('md5')
        .update(JSON.stringify(resource))
        .digest('hex');
}

export class Trakttv {

    constructor(options) {
        this.options = {
            headers: {
                'trakt-api-version': 2,
                'trakt-api-key': options.api_key,
            },
            username: options.username
        }


        this.client = got.extend({
            baseUrl: 'https://api.trakt.tv/users/',
            json: true,
            headers: Object.assign(
                {
                    'user-agent': `gatsby-source-trakttv (github.com/c0b41/gatsby-source-trakttv)`
                },
                this.options.headers
            )
        });

    }

    async getWatchedMovies() {

        try {
            const { body } = await this.client(`${this.options.username}/watched/movies`)
            return body
        } catch (error) {
            return null
        }

    }

    async getWatchedShows() {

        try {
            const { body } = await this.client(`${this.options.username}/watched/shows?extended=noseasons`)
            return body
        } catch (error) {
            return null
        }

    }

}