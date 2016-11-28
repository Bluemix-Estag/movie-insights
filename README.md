# Movies Insights - IBM Personality Insights

## Overview

Movie Insights é um aplicativo Node.js simples que utiliza o <b>IBM Personality Insights</b> para analizar sinopses de filmes e obter características que ajude a compreender as motivações por trás dos interesses dos espectadores na hora de decidir que filme assistir.

- Movie Insights [App Demo](http://moviesinsights.mybluemix.net)

## Contents

###Directory structure:
```
├── app.js
├── package.json
├── config
│   ├── error-handler.js
│   ├── express.js
│   ├── i18n.js
│   ├── security.js
├── i18n
│   ├── en.json
│   ├── es.json
├── node_modules
<!-- ALL MODULES -->
├── public/
│   ├── css/
│   │   ├── banner.css
│   │   ├── style-insights.css
│   │   ├── style.css
│   │   ├── watson-bootstrap-dark.css
│   ├── fonts/
│   │   ├── icon-fonts/
│   │   │   ├── icons.woff
│   ├── images/
│   │   ├── app.png
│   │   ├── placeholder_movie.png
│   │   ├── watson.gif
│   ├── js/
│   │   ├── i18n.js
│   │   ├── init.js
│   │   ├── personality.js
│   │   ├── string-utils.js
│   │   ├── textsummary.js
├── views/
│   ├── index.ejs
```

### Personality Insights

The IBM Watson Personality Insights service enables applications to derive insights from social media, enterprise data, or other digital communications. The service uses linguistic analytics to infer personality and social characteristics, including Big Five, Needs, and Values, from text.

The following links provide more information about the Personality Insights service:

* [IBM Watson Personality Insights - Service Page](http://www.ibm.com/watson/developercloud/personality-insights.html)
* [IBM Watson Personality Insights - Documentation](http://www.ibm.com/watson/developercloud/doc/personality-insights)
* [IBM Watson Personality Insights - Demo](https://personality-insights-livedemo.mybluemix.net)

## Usage

###RESTful API calls:

Este exemplo utiliza o site [AllMovie]:http://www.allmovie.com/ como fonte dos dados para a API:

```html
# Carregar todos os gêneros de filmes
http://moviesinsights.mybluemix.net/api/loadAllGenres?url=http://www.allmovie.com/genres

# Carregar todos os filmes de um gênero específico
http://moviesinsights.mybluemix.net/api/loadGenresMovies?url=http://www.allmovie.com/genre/action-d646

# Carregar informações de um filme
http://moviesinsights.mybluemix.net/api/loadMovieDetails?url=http://www.allmovie.com/movie/the-dark-knight-v357349
```
