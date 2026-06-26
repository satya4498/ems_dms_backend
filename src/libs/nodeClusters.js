import os from 'os'
import cluster from 'cluster'

export class ClusterService {
  constructor (appStartCallback) {
    this.appStartCallback = appStartCallback // Function to start your server/app
  }

  /**
   * Start the cluster service
   * This will fork workers for each CPU core
   * Each worker will run the application
   * The master process will manage the workers
   * This allows for load balancing and fault tolerance
   * Each worker can be restarted independently
   * The master process can also be restarted without downtime
   */
  start () {
    if (cluster.isPrimary) {
      const numCPUs = os.cpus().length
      console.log(`Master process ${process.pid} is running`)
      // Fork workers
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
      }
      // Listen for dying workers and restart
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`)
        cluster.fork()
      })
    } else {
      // Worker processes run the server/app
      this.appStartCallback()
    }
  }

  on (event, listener) {
    cluster.on(event, listener)
  }

  emit (event, ...args) {
    cluster.emit(event, ...args)
  }

  exit () {
    cluster.disconnect(() => {
      console.log(`Master process ${process.pid} is shutting down`)
    })
  }
}
