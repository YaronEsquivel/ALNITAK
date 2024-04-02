const config = require("./config.json");
var Generator = require("yeoman-generator");
const fs = require("fs");

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option("name", {
      type: String,
      required: true,
      default: "axity",
      desc: "Include name for the Microservice",
    });

    this.option("port", {
      type: Number,
      required: false,
      default: 9001,
      desc: "Port thats beign used to deploy",
    });

    this.option("modules", {
      type: Array,
      required: false,
      default: ["connection","env","error","interceptors","logger","server","stream"],
      desc: "modules available",
    });
  }

  initializing() {
    // Pre set the default props from the information we have at this point
    const directoriesNotSelected = fs
      .readdirSync(__dirname + "/templates/src/config/", {
        withFileTypes: true,
      })
      .filter((item) => item.isDirectory())
      .map((item) => item.name)
      .filter((item) => !config.modules.includes(item))
      .map((item) => "**/src/config/" + item);

    console.log(config.modules);
    
    this.props = {
      name: config.name,
      port: config.port,
      modules: directoriesNotSelected,
    };

    console.log(`Using this comfiguration ${JSON.stringify(this.props)}`);
  }

  writing() {
    var done = this.async();
        this.fs.copy(
            this.templatePath('.*'),
            this.destinationPath(`${this.props.name.toLowerCase()}-service/`)
        );
        this.fs.copyTpl(
            this.templatePath('.*'),
            this.destinationPath(`${this.props.name.toLowerCase()}-service/`), {
                name: this.props.name,
                namelower: this.props.name.toLowerCase(),
                port: this.props.port
            },
            {
                openDelimiter: '[',
                closeDelimiter: ']'
            }
        );
        this.fs.copyTpl(
            this.templatePath('**'),
            this.destinationPath(`${this.props.name.toLowerCase()}-service/`), {
                name: this.props.name,
                namelower: this.props.name.toLowerCase(),
                port: this.props.port
            },
            {
                openDelimiter: '[',
                closeDelimiter: ']'
            },
            { globOptions: { ignore: this.props.modules } }
        );
        this.fs.copyTpl(
            this.templatePath('*/**/*'),
            this.destinationPath(`${this.props.name.toLowerCase()}-service/`), {
                name: this.props.name,
                namelower: this.props.name.toLowerCase(),
                port: this.props.port
            },
            {
                openDelimiter: '[',
                closeDelimiter: ']'
            },
            { globOptions: { ignore: this.props.modules } }
        );
        done();
  }

  _updateServerTS() {
    var done = this.async();
    const npmdir = `${process.cwd()}/${this.props.name.toLowerCase()}-service`;
    const dirPath = `${npmdir}/${"src/config/server/server.ts"}`;
    console.log("path", dirPath);
    var fileData = fs.readFileSync(dirPath).toString("utf8");
    // Adding required Modules to ./src/config/server/server.ts
    console.log(`Registering modules to ${process.cwd()}/${this.props.name.toLowerCase()}-service/src/config/server/server.ts`);
    
    var modules="";
    
    modules+=`let allTopics = [
             'pruebas',
             'test'
         ];
         let topicsToSubscribe = [
             'pruebas',
             'test'
         ];
         Kafka.init(allTopics).then(async() => {
        
             await Kafka.suscribe(topicsToSubscribe, (topic: any, partition: any, message: any)=>{
                 console.log('Topic: ', topic, 'Partition: ',partition, 'Message: ',message?.value?.toString())
             });
             console.log('Connected to Kafka');
         })
         .catch(err => console.error('Error connecting kafka', err))\n`
    

    fileData = fileData.replace(/SETUP:MODULES/g,modules);

    
    
    // (over)write file: setting 'utf8' is not actually needed as it's the default
    fs.writeFileSync(dirPath, fileData, "utf8");

    done();
  }

  

  install() {
    this._updateServerTS();
    var done = this.async();
    this.spawnCommand("npm", ["install"], {
      cwd: `${this.props.name}-service/`,
    }).on("error", function (err) {
      done(err);
    });
  }
  
  _capitalizeFirstLetter(str){
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
}
};