(function() {

window.App = {
	Models: {},
	Collections: {},
	Views: {}
};

window.template = function(id) {
	return _.template( $('#' + id).html() );
};

App.Models.Task = Backbone.Model.extend({
	defaults: {
		name: '1'
	}
});

App.Collections.Tasks = Backbone.Collection.extend({
	model: App.Models.Task
});


App.Views.Tasks = Backbone.View.extend({
	tagName: 'ul',

	className: 'list-unstyled text-center',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
	},

	render: function() {
		this.collection.each(this.addOne, this);

		return this;
	},

	addOne: function(task) {
		var taskView = new App.Views.Task({ model: task });
		this.$el.append(taskView.render().el);
	}
});

App.Views.Task = Backbone.View.extend({
	tagName: 'li',

	className: 'task',

	template: template('taskTemplate'),

	my_template: _.template('<li class="task"><p contenteditable="true"><%= name %></p></li><button class="btn btn-primary edit">Edit</button><button type="button" class="btn btn-default delete">Edit</button>'),

	initialize: function(){
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},

	events: {
	 'click .delete' : 'DestroyTask'
	},

	DestroyTask: function(){
		this.model.destroy();
	},

	remove: function(){
		this.$el.remove();
	},

	render: function() {
		this.$el.html( this.template(this.model.toJSON()) );
		return this;
	}
});


App.Views.AddTask = Backbone.View.extend({
	el: '.btn-add',

	events: {
		'click': 'submit'
	},

	submit: function(e) {
		e.preventDefault();
		var newTaskName = $(e.currentTarget).find('input[type=text]').val();
		var task = new App.Models.Task({ name: newTaskName });
		this.collection.add(task);

	}
});


var tasksCollection = new App.Collections.Tasks([]);
var addTaskView = new App.Views.AddTask({ collection: tasksCollection });
tasksView = new App.Views.Tasks({ collection: tasksCollection });
$('.tasks-holder').append(tasksView.render().el);
})();
