const optionsHandler = require('./options');

class MySequelize {
    constructor(connect, tableName) {
        this.connection = connect;
        this.table = tableName;
    }

    async create(obj) {
        await this.connection.query(
            `INSERT INTO ${this.table} SET ?`, obj
        )
    }

    async bulkCreate(arr) {
        arr.map(obj => {
            return this.connection.query(
                `INSERT INTO ${this.table} SET ?`, obj
            )
        })
    }

    async findAll(options) {
        if (!options) {
            const result = await this.connection.query(`SELECT * FROM ${this.table}`)
            return result[0];
        }
        let limitQuery = '';
        let orderQuery = '';
        let whereQuery = '';
        let includeQuery = [];
        let attributesQuery = '';
        for (let prop in options) {
            if (prop === 'limit') limitQuery = ` LIMIT ${options[prop]} `
            if (prop === 'order') orderQuery = ` ORDER BY ${options[prop][0]} ${options[prop][1]} `
            if (prop === 'include') {
                // options[prop].map(table => {
                //     tablesArr.push(table.table);
                //     onsArr.push(`${table.table}.${table.tableForeignKey} = ${this.table}.${table.sourceForeignKey}`);
                // })
                await options.include.forEach(async table => {
                    let included = await this.connection.query(`
                    SELECT * 
                    FROM ${table.table}
                    `)
                    // WHERE ${table.table}.${table.tableForeignKey} = ${this.table}.${table.sourceForeignKey};
                    included[0].forEach(row => includeQuery.push(row))
                    // includeQuery = included[0].map(row => row)
                    console.log('include-in', includeQuery)
                })
                console.log('include-out', includeQuery)
                // console.log('includeQuery', includeQuery)
            }
            if (prop === 'where') {
                for (let condition in options.where) {
                    whereQuery = `WHERE ${condition} = '${options.where[condition]}'`
                }
            }
            if (prop === 'attributes') {
                let attributesArr = options[prop].map(attribute => {
                    if (typeof attribute === 'string') return attribute;
                    if (typeof attribute === 'object') return attribute.join(' AS ');
                })
                attributesQuery = attributesArr.join(', ');
            }
        }
        const sqlQuery = `
        SELECT ${attributesQuery ? attributesQuery : '*' }
        FROM ${this.table}
        ${whereQuery ? whereQuery : ''}
        
        ${orderQuery ? orderQuery : ''}
        ${limitQuery ? limitQuery : ''};
        `;
        const results = await this.connection.query(sqlQuery);
        // console.log('query', sqlQuery)
        // console.log('data', results[0])
        return results[0];
        
        // ${includeQuery ? includeQuery.toString() : ''}

        /*
        Model.findAll({
            where: {
                is_admin: false
            },
            order: ['id', 'DESC'],
            limit 2
        })
        */

        /*
        Model.findAll({
            include:[
                {
                    table: playlists,             // table yo want to join
                    tableForeignKey: "creator",   // column reference in the table yo want to join
                    sourceForeignKey: "id",       // base table column reference
                }
            ] 
        })
        */

        /*
        Model.findAll({
            where: {
                [Op.gt]: {
                    id: 10
                },                // both [Op.gt] and [Op.lt] need to work so you can pass the tests
                [Op.lt]: {        
                    id: 20
                }
        })
        */
    }

    async findByPk(id) { 
        const results =  await this.connection.query(`
        SELECT * FROM ${this.table}
        WHERE id = ${id};
        `)
        return results[0];
        /*
            Model.findByPk(id)
        */
    }

    async findOne(options) {
        /*
            Model.findOne({
                where: {
                    is_admin: true
                }
            })
        */
    }

    async update(newDetsils, options) {
        /*
            Model.update( { name: 'test6', email: 'test6@gmail.com' } , {
                where: {                                                      // first object containing details to update
                    is_admin: true                                            // second object containing condotion for the query
                }
            })
        */
    }

    async destroy({ force, ...options }) {
        /*
            Model.destroy({
                where: {                                                      
                    is_admin: true                                            
                },
                force: true      // will cause hard delete
            })
        */

        /*
           Model.destroy({
               where: {                                                      
                   id: 10                                           
               },
               force: false      // will cause soft delete
           })
       */
        /*
           Model.destroy({
               where: {                                                      
                   id: 10                                           
               },  // will cause soft delete
           })
       */

    }

    async restore(options) {
        /*
           Model.restore({
               where: {                                                      
                   id: 12                                          
               }
           })
       */
    }

}

module.exports = { MySequelize };