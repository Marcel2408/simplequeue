# simplequeue: the simple queue system

`simplequeue` is a very simple queue, similar to RabbitMQ or Kafka.  It is supposed to have the
following features:

  1. Clients may submit jobs
  2. Jobs may be submitted multiple times, but any given job with a given ID will only be added to
     the queue once.
  3. Jobs may be requested, which will mark their state as running and remove them from the queue
     (but still track their status)
  4. Jobs may be marked as completed successfully or completed failed, which again keeps them
     out of the queue, but still allows their status to be queried

## Job-related endpoints

This is handled via a collection of endpoints.  Four of the endpoints handle querying, submitting,
and retrieving jobs.  These endpoints are:

- `/jobs`: GET endpoint, returns an array of jobs (see JSON structure below)
- `/jobs/submit`: POST endpoint, submit a job (see JSON structure below)
- `/jobs/:id`: GET endpoint, get the status of a given job (returns a job )
- `/jobs/next`: GET endpoint, return the next job in the queue and mark it as `running`

These endpoints all work with the following JSON structure:

- `jobId`: a unique, arbitrary string, such as a UUID
- `description`: an optional human-readable string
- `state`: can be any of `submitted`, `running`, `failed`, or `succeeded`. This **should not** be
  supplied by a client, but instead is created and manipulated by `simplequeue`
- `data`: an optional arbitrary JSON object with data

Sample:

```json
    {
        "jobId": "a unique, arbitrary string",
        "description": "a human-readable description",
        "state": "running",
        "data": {"message": "hello, world"}
    }
```

Additionally, there is one other endpoint for marking jobs complete:

- `/jobs/complete`: POST endpoint to mark a job as done

This endpoint takes a different JSON structure:

- `jobId`: the job ID
- `status`: either `failed` or `succeeded`

Sample:

```json
{
    "jobId": "1a2b3c4d",
    "status": "failed"
}
```

## Normal usage

A normal flow would be for one client to submit a job to `/jobs/submit`, another client to retrieve
the next job via `/jobs/next`, and then for that client to call `/jobs/complete` when done to mark
the job as succeeded or failed.  For example:

1. `POST /jobs/submit` with `{"jobId": "1a2b3c", "description": "Sample job"}`
2. `GET /jobs/next`, returning `{"jobId": "1a2b3c", "description": "Sample job", "status": "running}
3. `POST /jobs/complete` with `{"jobId": "1a2b3c", "status": "succeeded"}

## Dashboard

A *very* minimal dashboard is also available at `/`.  It updates the list of jobs once per second.

## Tasks

Sadly, `simplequeue` doesn't work perfectly.  It's got some bugs.  For this exercise, we'd like to:

 1. Find the bugs
 2. Add tests to demonstrate the bugs
 3. Fix the bugs so the tests pass

We're also suspect that both the API and dashboard could use some improvements.  Feel free to
make what changes you see fit.
