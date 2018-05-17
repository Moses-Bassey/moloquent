

module.exports = class Wrapper{

    static get(query, projection = {}){
        return this.find(query, projection)
    }

    static getOne(query, projection = {}){
        return this.findOne(query, projection)
    }

    static getOneOrMany(query, projection = {}){
        return new Promise((resolve, reject)=>{
            this.get(query, projection)
            .then(result =>  result.length == 1 ? resolve(result[0]) : resolve(result), reject)
            .catch(reject)
        })
    }

    static getOrFail(query, projection = {}){
        return new Promise((resolve, reject)=>{
            this.get(query, projection)
            .then(result => result.length ? resolve(result) : reject(result), reject)
            .catch(reject)
        })
    }

    static getOneOrFail(query, projection = {}){
        return new Promise((resolve, reject)=>{
            this.getOne(query, projection)
            .then(result => result ? resolve(result) : reject(result), reject)
            .catch(reject)
        })
    }

    static getOneAndEdit(query, editQuery, body, projection = {}){
        return new Promise((resolve, reject)=> {
                    this.edit(editQuery,body)
                    .then(() => this.getOne(query, projection), reject)
                    .then(resolve, reject)
                    .catch(reject)
        })            
    }

    static getManyAndEdit(query, editQuery, body, projection = {}){
        return new Promise((resolve, reject)=> {
            this.editMany(editQuery,body)
            .then(() => this.get(query, projection), reject)
            .then(resolve, reject)
            .catch(reject)
        })
    }

    static getOneAndUpdate(query, editQuery, body, projection = {}){
        return new Promise((resolve, reject)=> {
                    this.update(editQuery,body)
                    .then(() => this.getOne(query, projection), reject)
                    .then(resolve, reject)
                    .catch(reject)
        })            
    }

    static getManyAndUpdate(query, editQuery, body, projection = {}){
        return new Promise((resolve, reject)=> {
            this.updateMany(editQuery,body)
            .then(() => this.get(query, projection), reject)
            .then(resolve, reject)
            .catch(reject)
        })
    }




    static getOrCreate(query, body, projection={}){
        return new Promise((resolve, rejecet)=> {
            this.getOrFail(query, projection)
                .then(resolve, () => this.create(body))
                .then(resolve, reject)
                .catch(reject)
        })
    }

    static edit(query, body){
        return this.findOneAndUpdate(query, body, {new : true})
    }

    static editOrFail(query, body){
        return new Promise((resolve, reject)=>{
            this.edit(query, body)
            .then(result => result ? resolve(result) : reject(result), reject)
            .catch(reject)
        })
    }

    static editMany(query, body){
        return new Promise((resolve, reject)=> {
            this.updateMany(query, body)
            .then(() => this.get(query), reject)
            .then(resolve, reject)
            .catch(reject)
        })
    }

    static editManyOrFail(query, body){
        return new Promise((resolve, reject)=> {
            this.editMany(query, body)
            .then(result => result.length ? resolve(result) : reject(result), reject)
            .catch(reject)
        })
    }

    static updateMany(query, body){
        return this.update(query, body, {multi: true})
    }

    static delete(query){
        return this.findOneAndRemove(query)
    }

    static deleteOrFail(query){
        return new Promise((resolve, reject)=> {
            this.delete(query)
            .then(result => result ? resolve(result) : reject(result), reject)
            .catch(reject)
        })
    }

    static deleteMany(query){
        return this.remove(query)
    }

    static deleteManyOrFail(query){
        return new Promise((resolve, reject)=> {
            this.deleteMany(query)
            .then(result => result ? resolve(result) : reject(result), reject)
            .catch(reject)
        })
    }
}