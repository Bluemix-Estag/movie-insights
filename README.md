# Movies Insights - IBM Personality Insights

## Overview

Movie Insights é um aplicativo Node.js simples que utiliza o <b>IBM Personality Insights</b> para analizar sinopses de filmes e obter características que ajude a compreender as motivações por trás dos interesses dos espectadores na hora de decidir que filme assistir.

There are many resources to help you build your first cognitive application with the iOS SDK:
- Read the [Readme](README.md)
- Follow the [QuickStart Guide](docs/quickstart.md)
- Review a [Sample Application](#sample-applications)
- Browse the [Documentation](http://watson-developer-cloud.github.io/ios-sdk/)

## Contents

Directory structure:
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
