const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');
const Task = require('../models/Task');

// Update the TaskType to include taskId
const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
        id: { type: GraphQLID },
        taskId: { type: GraphQLString },  // New field for custom task identifier
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        createdAt: { type: GraphQLString },
    }),
});

// Update the RootQuery to include queries for taskId starting with '01'
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        task: {
            type: TaskType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Task.findById(args.id);
            },
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve() {
                return Task.find();
            },
        },
        tasksWithPrefix: {  // New query to get tasks with taskId starting with '01'
            type: new GraphQLList(TaskType),
            args: { prefix: { type: GraphQLString } },
            resolve(parent, args) {
                return Task.find({ taskId: { $regex: '^' + args.prefix } }); // Filtering by prefix
            },
        },
    },
});

// Update the Mutation to include taskId when adding tasks
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTask: {
            type: TaskType,
            args: {
                taskId: { type: new GraphQLNonNull(GraphQLString) },  // Custom task ID
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLString },
                status: { type: GraphQLString },
            },
            resolve(parent, args) {
                const task = new Task({
                    taskId: args.taskId,  // Include taskId when saving
                    title: args.title,
                    description: args.description,
                    status: args.status,
                });
                return task.save();
            },
        },
        deleteTask: {
            type: TaskType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Task.findByIdAndRemove(args.id);
            },
        },
        updateTask: {
            type: TaskType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLString },
            },
            resolve(parent, args) {
                return Task.findByIdAndUpdate(args.id, args, { new: true });
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
