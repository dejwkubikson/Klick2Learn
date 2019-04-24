import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo';

import './main.html';

// no var because it's a global variable
CompletedList = new Mongo.Collection('Completed');

if(Meteor.isClient){
	// counter starts at 0
	this.counter = new ReactiveVar(0);

	// at the start the answers aren't completed
	this.completed = new ReactiveVar(false);
	
	// variables
	var draggingToTarget, draggedSourceID, answeredRight;
	
	// when the user picks his answer, this function looks for the right target field where he should drop it
	function LookForTarget(source){
		
		// assigns an integer from the source id
		source = source.match(/\d+/);
		
		// due to the fact that the answers are in order this returns the right target id (where the box should be placed)
		return "target" + source;

		/* Hard code (when answers are in order)
		if(source == "answer1")
			return "target1";
			
		if(source == "answer2")
			return "target2";
			
		if(source == "answer3")
			return "target3";
		
		if(source == "answer4")
			return "target4";
		
		if(source == "answer5")
			return "target5";
		*/
	}

	// this functions checks the answer, if it's right, it places the source box inside the target field.
	function CheckAnswer(whatIsTarget, target){
		
		if(target == whatIsTarget){
			// creating variables for easier access to the dragged source element and the target element
			var dragElement = document.getElementById(draggedSourceID);
			var targetElement = document.getElementById(target);
			
			// assigning a new class to the target field (all previous classes are removed - ddwidth7, ddlline, ddseatedtarget)
			targetElement.className = "ddseatedtarget2";
			
			// removing the &nbsp from target field
			targetElement.innerHTML = "";
			
			// creating a div element inside it
			var div = document.createElement('div')
			// assigning the word from the source box to the new div in the target field
			div.innerHTML = dragElement.innerHTML;
			// adding classes to the created div
			div.classList.add('ddwidth7', 'dd1line', 'ddsourceseated')
			// creating it inside the target element with class ddseatedtarget2
			targetElement.appendChild(div);
			
			// removing the word from the source box
			dragElement.innerHTML = "";
			
			// removing classes shadow and ddsourceseated, adding ddsourceseated2
			dragElement.classList.remove('shadow', 'ddsourceseated');
			// adding the class ddsourceseated2 to the leftover element and disabling the drag option
			dragElement.classList.add('ddsourceseated2');
			dragElement.setAttribute('draggable', false);
			
			/* removes the whole ddsourceseated2 box
			var toRemove = document.getElementById(draggedSourceID).parentElement;
			toRemove.removeChild(toRemove.childNodes[0]);
			*/
			
			// incrementing the counter when user picks the right answer
			counter.set(counter.get() + 1);
			
			// checking how many questions are to be answered
			var howManyAnswers = document.getElementsByClassName('olcircle')[0].getElementsByTagName('li');
			howManyAnswers = howManyAnswers.length;
						
			// displaying the template "complete" when the user picks all the answers right
			if(counter.get() == howManyAnswers)
			{
				completed.set(true);
				AddEntry();
			}
			
		}else{
			// wrong answer
		}
	}

	// this function inserts an entry into a collection
	function AddEntry(){
		
		// checking if client and server are connected
		if(Meteor.status())
			CompletedList.insert({user_name: "user123", completed_section: 1});
			//CompletedList.update({_id: CompletedList.findOne({user_name : "user123"})._id}, {$set: {completed_section: 1}});
	}
	
	Template.body.helpers({
		completed: function(){
			return completed.get();
		}
	});

	Template.drag.helpers({
		counter: function(){
			return Template.instance().counter.get();
		}
	});

	Template.drag.events({	
		// starts when the user starts dragging
		'dragstart .ddsourceseated': function(event){
			// getting the chosen box's id
			draggedSourceID = event.currentTarget.id;
			// looking for the target
			draggingToTarget = LookForTarget(draggedSourceID);		
		},
		
		// starts when the user releases the mouse button over a target field
		'drop .ddseatedtarget': function(event){
			event.preventDefault();
			CheckAnswer(draggingToTarget, event.target.id);
		},
		
		// prevents default behaviour of the dragover on the target field
		'dragover .ddseatedtarget': function(e){
			event.preventDefault();
		}
	});

	Template.drag.rendered = function() {
		
	}

}