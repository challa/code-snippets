const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const sampleDeployment = require('./deployment.json');
const crdJson = require('./crd.json');
const serviceJson = require('./service.json');
const _ = require('lodash');
try {
  serviceJson.spec.selector.couchdb_cr = "service-fabrik"
  sampleDeployment.metadata.name = "service-fabrik"
  serviceJson.metadata.name = "service-fabrik-service"
  const Client = require('kubernetes-client').Client
  const config = require('kubernetes-client').config
  const client = new Client({ config: config.fromKubeconfig(), version: '1.9' })
  client.loadSpec()
     .then(() => client.addCustomResourceDefinition(crdJson))
     .then(() => client.apis['cache.example.com'].v1alpha1.namespaces('default').couchdbs("example-couchdb").get())
     .then(() => client.api.extensions.v1beta1.namespaces('default').deployments("example-couchdb").get())
     .then(service => {getCredentials(service)})
     .then(()=>client.api.v1.namespaces('default').service("couchdb-ip-service").get())
     .then(service => getHostService(service))
     .catch(e => console.log('Error: ', e));
} catch (err) {
  console.error('Error: ', err);
}
function getHostService(service)
{
  console.log(service.body.status.loadBalancer.ingress[0].hostname);
  console.log(service.body.spec.ports[0].port);

}

function getCredentials(service) {
    var enviVars = service.body.spec.template.spec.containers[0].env
    var user_name=""
    var user_pass=""
    for (var i = 0, l = enviVars.length; i < l; i++) {
       if (enviVars[i].name === "COUCHDB_USER"){
           user_name=enviVars[i].value;
       }

       if (enviVars[i].name === "COUCHDB_PASSWORD") {
        user_pass = enviVars[i].value
       }
    }
   console.log(user_name)
   console.log(user_pass)
}
