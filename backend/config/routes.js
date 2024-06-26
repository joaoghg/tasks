module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signIn)

    app.route('/tasks')
        .all(app.config.passport.authenticate())
        .get(app.api.task.getTasks)
        .post(app.api.task.save)

    app.route('/tasks/:id')
        .all(app.config.passport.authenticate())
        .delete(app.api.task.remove)
        .put(app.api.task.toggleTask)

}
