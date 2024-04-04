const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'))

const port = 3000
const queue = [];
const jobs = {};

app.get('/jobs', (req, res) => {
    res.send(JSON.stringify(jobs));
})

app.get('/jobs/:id', (req, res) => {
    res.json(jobs[req.params.id])
});

app.post('/jobs/submit', (req, res) => {
    const job = {
        status: 'queued',
        ...req.body
    };
    queue.push(job);
    jobs[job.jobId] = job;
    res.json(job);
})

app.get('/jobs/next', (req, res) => {
    const job = queue.shift();
    if (job) {
        job.status = 'running';
        res.json(job);
    } else {
        res.json({});
    }
})

app.post('/jobs/complete', (req, res) => {
    const completion = req.body
    const job = jobs[completion.jobId];
    if (job) {
        job.status = 'success';
        res.json(job);
    } else {
        res.json({});
    }
})

app.listen(port, () => {
  console.log(`simplequeue running on ${port}`)
})
