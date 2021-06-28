const express = require('express');
const dotenv = require('dotenv');
dotenv.config()

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'keywords': {
                'emotion': true,
                'limit': 1,
            },
        }
    };

    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        actualResults = analysisResults.result.keywords[0]
        console.log(JSON.stringify(actualResults, null, 2));
        res.send(actualResults.emotion);
    })
    .catch(err => {
        console.log('error:', err);
        res.send('error:', err);
    });
    // return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
   const analyzeParams = {
        'url': req.query.url,
        'features': {
            'keywords': {
                'sentiment': true,
                'limit': 1,
            },
        }
    };

    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        actualResults = analysisResults.result.keywords[0]
        console.log(JSON.stringify(actualResults, null, 2));
        res.send(actualResults.sentiment.label);
    })
    .catch(err => {
        console.log('error:', err);
        res.send('error:', err);
    });
    //return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
   const analyzeParams = {
        'text': req.query.text,
        'features': {
            'keywords': {
                'emotion': true,
                'limit': 1,
            },
        }
    };

    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        actualResults = analysisResults.result.keywords[0]
        console.log(JSON.stringify(actualResults, null, 2));
        res.send(actualResults.emotion);
    })
    .catch(err => {
        console.log('error:', err);
        res.send('error:', err);
    });
    //return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'keywords': {
                'sentiment': true,
                'limit': 1,
            },
        }
    };

    getNLUInstance().analyze(analyzeParams)
    .then(analysisResults => {
        actualResults = analysisResults.result.keywords[0]
        console.log(JSON.stringify(actualResults, null, 2));
        res.send(actualResults.sentiment.label);
    })
    .catch(err => {
        console.log('error:', err);
        res.send('error:', err);
    });
    //return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

