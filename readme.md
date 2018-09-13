# gatsby-source-trakttv

Source plugin for pulling data into Traktv account to Wacthed History endpoint.


## Install

`yarn install gatsby-source-trakttv`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-trakttv`,
    options: {
      api_key: 'INSERT_APIKEY',
      username: 'INSERT_USERNAME'      
    },
  },
];
```

### Example Queries

```graphql
query {
    TrakttvWatchedMovies{
        id,
        movie {
            title
        }
    }
}
``` 

```graphql
query {
    TrakttvWatchedShows{
        id,
        show {
            title
        }
    }
}
``` 