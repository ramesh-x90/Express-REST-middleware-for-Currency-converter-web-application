import cluster from 'node:cluster';
import { cpus } from 'node:os';
import process from 'node:process';


import { App, AppArgs } from "./app";



const args: AppArgs = {
    _port: 4000,
    endPointProtocol: "http",
    endPointHost: "localhost",
    endPointPort: 8080,
    endPointPath: "/ws/currencyConvertService"
}


const numCPUs = cpus().length;



if (cluster.isPrimary) {

    console.log({ appArgs: args })
    console.log(`Primary pid: ${process.pid}`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Redundancy spin a new work in case of failure in a worker
    cluster.on('disconnect', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("restarting worker")
        setTimeout(cluster.fork, 5000)
    });


    cluster.on("message", (worker, message, handle) => {

    })


} else {
    App(args).catch(
        e => {
            process.disconnect()
        }
    );

    console.log(`Worker pid: ${process.pid} started`);


}







