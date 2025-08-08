const EnvConfig = () => {
  let Config = {
    env: {
      stage: {
        baseUrl: "https://stage-highway.palletnow.co/proxy/",
        header: {
          authKey: "",
        },
        domainUrl: "https://stage-highway.palletnow.co",
        signupUrl: "https://stage-signup.palletnow.co/signup",
      },
      development: {
        baseUrl: "https://dev-gateway.palletnow.co/proxy/",
        //baseUrl: "https://stage-highway.palletnow.co/proxy/",
        header: {
          authKey: "",
        },
        domainUrl: "https://dev-gateway.palletnow.co",
        signupUrl: "https://dev-signup.palletnow.co/signup",
      },
      production: {
        baseUrl: "https://highway.palletnow.co/proxy/",
        header: {
          authKey: "",
        },
        domainUrl: "https://highway.palletnow.co/",
        signupUrl: "https://palletnow.co/signup",
      },
    },
  };
  let node_env = process.env.MY_ENV;
  return {
    baseConfigUrl: Config.env[node_env].baseUrl,
    domainUrl: Config.env[node_env].domainUrl,
    signupUrl: Config.env[node_env].signupUrl,
  };
};
export default EnvConfig;
