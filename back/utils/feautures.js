const Model = require('../models/emailModel');

class APIFeautures {
    constructor(query, queryfile) {
        this.query = query;
        this.queryfile = queryfile;
    }

    //filter method 
    filter = () => {
        const { priority, category, search } = this.queryfile;
        const query = {};
        if (search) {
            query.from = { $regex: search, $options: 'i' };
        }
        if (priority) {
            const priorities = priority.split(',').map(p => p.trim());
            query['priority.level'] = { $in: priorities };
        }
        if (category) {
            const categories = category.split(',').map(c => c.trim());
            query['category.type'] = { $in: categories };
        }
        this.query = this.query.find(query);
        return this;
    };



    sort = () => {
        if (!this.queryfile.sort) {
            return this;
        }
        const sortOptions = this.queryfile.sort.split(',').join(' ');
        console.log(sortOptions);
        this.query = this.query.sort(sortOptions);
        console.log(this.query);
        return this;
    }

    paginate = () => {
        const page = this.queryfile.page;
        const skip = (page - 1) * 10;
        this.query = this.query.skip(skip).limit(10);
        return this
    }
}

module.exports = APIFeautures;