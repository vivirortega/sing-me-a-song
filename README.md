<div align="center">
<h1>Sing-me-a-song 🎙️</h1>
</div>

<h2>About the project:</h2>
Sing me a song is an application for anonymous recommendation of songs. The more people like a recommendation, the more likely it is to be recommended for others.


<h2>Technologies:</h2>
<div align="center">
<img src="https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e">
<img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white">
</div>

<h2>Routes:</h2>

```yml 
POST /recommendations
    - Create a recommendation
    - headers: {}
    - body:{
        "name": "mitski - glide (cover)",
        "youtubeLink": "https://www.youtube.com/watch?v=EG9t7Wsc9YU" 
} 
```

```yml 
POST /recommendations/:id/upvote
    - Vote in a recommendation
    - headers: {}
    - body:{} 
```

```yml 
POST /recommendations/:id/downvote
    - Vote in a recommendation
    - headers: {}
    - body:{} 
```

```yml 
GET /recommendations/
    - Return all recommendations
    - headers: {}
    - body:{} 
```

```yml 
GET /recommendations/:id
    - Return recommendations by id
    - headers: {}
    - body:{} 
```

```yml 
GET /recommendations/random
    - Return a random recommendation
    - headers: {}
    - body:{} 
```

```yml 
GET /recommendations/top/:amount
    - Return a recommendation by score
    - headers: {}
    - body:{} 
```

<h2>How to run:</h2>

<h3>Clone the repository:</h3>

```
$ git clone https://github.com/unverzed/sing-me-a-song.git
```
<h3>Install dependencies:</h3>

```
$ npm or yarn install
```
<h3>Initializing the API:</h3>

```
$ npm run dev
```
