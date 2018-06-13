<template>
    <div class="page-container card p-4">
      <!-- The course form is shown only if courseform is true -->
      <div class="row animated fadeIn" v-if="courseform">
        <!-- A left sidebar for desktop screens, still debating the UI's beauty -->
            <!-- <div class="col-lg-5 d-none d-lg-inline-block">
                <div class="w-100"style="background-image: url('img/stgen-logo-purple-bg.png'); background-size: cover; background-position: center; height: 100%;"></div>    
            </div>
             -->
          <!-- </div> -->
          <div class="col-lg-12">

              <div class="card-body">

                  <!-- Material form register -->
                  <div id="courseform">
                      <p class="h4 text-center py-4">Enter Courses</p>

                      <div class="row">
                        <div class="md-form col-lg-6">
                          <!-- value here is modeled to weekdayHours -->
                            <input type="number" class="form-control" placeholder="Hours per weekday" v-model="weekdayHours" required>
                            
                            <small class="font-weight-light">How Many hours <b>per day</b> can you read on a weekday (Mon-Fri)</small>
                        </div>

                        <div class="md-form col-lg-6">
                          <input type="number" class="form-control" placeholder="Hours per weekend" v-model="weekendHours" required>
                          
                            <small class="font-weight-light">How Many hours <b>per day</b> can you read on a weekend (Sat-Sun)</small>
                        </div>  
                      </div>

                      


                      <small class="small d-block">What courses do you want to read</small>
                      <!-- for as many courses we have in the courses array, we start with a default two... but each coursehas null values in their constructor, we could use that for validation -->
                      <div class="animated fadeIn row lighten-5" v-for="(course, index) in courses" v-bind:class="{purple: index%2==0}">
                          
                          <div class="col-lg-4">
                              <!-- Material input text -->
                              <div class="md-form">
                                <input type="text" class="form-control" placeholder="Course" v-model="course.coursename" required>
                                  
                              </div>
                          </div>

                          <div class="col-lg-4">
                              <!-- Material input text -->
                              <div class="md-form">
                                <input type="number" class="form-control" v-model="course.units" placeholder="Course Units" required>
                                
                              </div>
                          </div>

                          <div class="col-lg-4">
                              <!-- Material input text -->
                              <!-- <div class="md-form">
                                  <input type="number" class="form-control" v-model="course.difficulty">
                                  <label class="font-weight-light">Difficulty (1-3)</label>
                              </div> -->
                              <div class="md-form">
                                <select class="form-control" v-model="course.difficulty" required>
                                  
                                      <option disabled selected value="null">Difficulty</option>
                                      <option value="1">Easy</option>
                                      <option value="2">medium</option>
                                      <option value="3">Technical</option>
                                  
                               </select>
                                  
                                  
                                  <!-- <label class="font-weight-light">Difficulty</label> -->
                              </div>

                          </div>

                          <a class="btn btn-elegant p-1" style="position: absolute; right: 5%; font-size: 1.0rem;" @click="deleteCourse(index)"><i class="fa fa-times"></i></a>

                      </div>


                      <div class="d-flex flex-wrap text-center py-4 mt-3">
                        <!-- add course on click -->
                          <button class="btn btn-primary" id="add" @click="addCourse"><i class="fa fa-plus"></i> New Course</button>

                          <!-- prevent default, call computeResults -->
                          <button class="btn btn-primary" type="submit" id="submit" @click.prevent="computeResults">Get Timetable</button>
                          
                      </div>
                  </div>
                  <!-- Material form register -->

              </div>
              <!-- Card body -->

          </div>
          <!-- Card -->
           
      </div>

      <!-- This is the results panel, it's shown once we click generate results -->
      <div class="animated fadeIn" v-if="results">
        <p>Hello, The following study plan has been generated for you based on your request. Make sure to store it...</p>
        <div class="row">
          <div class="col-md-6">
            <!-- see object duration's value below -->
            <p>Each weekday period lasts <span class="text-primary">{{duration.weekdays}}</span> hours</p>
            <p>Each weekend period lasts <span class="text-primary">{{duration.weekends}}</span> hours</p>
          </div>
          <div class="col-md-6 d-flex">
            <!-- returns the courseform panel on click -->
            <button class="btn btn-primary ml-auto" @click="editCourses">Edit Courses</button>
          </div>
        </div>

        <div class="table-responsive">

        <table class="table">
          <thead class="secondary-color text-white py-2">
              <tr>
                  <th>Day</th>
                  <th v-for="(period, index) in timetable[0]">Period {{index}} </th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="(day, index) in timetable">
              <th scope="row">{{days[index]}}</th>
              <td v-for="(period, index) in timetable[index]">{{period}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      </div>

      
    </div>
</template>

<script>
// As this project uses eslint to compile to es5, please note that there are serious rules of indentation, spacing etc and semicolon is not allowed
class Course {
  // constructors default to null
  constructor (coursename = null, units = null, difficulty = null) {
    this.coursename = coursename
    this.units = units
    this.difficulty = difficulty
  }

  priority () {
    return this.units * this.difficulty
  }

  // how many times does it occur
  occurs (totalpriority, ppw) {
    // approximate
    return Math.round(this.priority() * ppw / totalpriority)
  }
}

// periodsperday, simple enough
function periodsperday (hours) {
  if (hours <= 2) {
    return 1
  } else if (hours < 4) {
    return 2
  } else {
    return 3
  }
}

function periodduration (ppd, hours) {
  return hours * 60 / ppd
}

// insert function is called whenever we need to insert a course in a timetable,
// takes a course object, periods per day, and timetable array
function insert (course, ppd, timetable) {
  // see if there's space left in the timetable, timetable must be fully init with predef size
  let m = 0
  const ttt = timetable
  // ttt.foreach kept giving problems. We assume ttt is multidimensional with i rows and j columns each
  for (let i = 0; i < ttt.length; i++) {
    // if a column includes an empty object
    if (ttt[i].includes(undefined)) {
      m++
    }
  }
  if (m === 0) {
    return
  }
  let x = Math.floor(Math.random() * timetable.length)
  let y = Math.floor(Math.random() * ppd)

  if (timetable[x][y] === null || timetable[x][y] === undefined) {
    timetable[x][y] = course.coursename
  } else {
    // if the generated slot is occupied, try again
    insert(course, ppd, timetable)
  }
}

function makeTable (courses, weekendHours, weekdayHours) {
  let timetable = []
  // 5 days in weekday, 2 days in weekend
  let weeklyTimetable = Array(5)
  let weekendTimetable = Array(2)
  // periods per day
  let ppd = periodsperday(weekdayHours)
  let ppwd = periodsperday(weekendHours)
  // periods per week
  let ppw = 5 * ppd
  let ppwWeekends = 2 * ppwd

  // calc total priority to know how often each course occurs
  let totalpriority = 0
  for (let i = 0; i < courses.length; i++) {
    totalpriority += courses[i].priority()
  }

  for (let i = 0; i < weeklyTimetable.length; i++) {
    weeklyTimetable[i] = Array(ppd)
  }
  for (let i = 0; i < weekendTimetable.length; i++) {
    weekendTimetable[i] = Array(ppwd)
  }

  // go through each cell in the timetable and fill it...
  for (let i = 0; i < courses.length; i++) {
    // for the number of times each course should occur
    for (let j = 0; j < courses[i].occurs(totalpriority, ppw); j++) {
      // insert courses in weekly timetable
      insert(courses[i], ppd, weeklyTimetable)
    }
    // same for weekends
    for (let k = 0; k < courses[i].occurs(totalpriority, ppwWeekends); k++) {
      // insert courses in weekend timetable
      insert(courses[i], ppwd, weekendTimetable)
    }
  }
  // oh well, let's just push both timetables in the main timetable shall we
  weeklyTimetable.forEach((day) => timetable.push(day))
  weekendTimetable.forEach((day) => timetable.push(day))

  return timetable
}

export default{
  // all the above are just functions, the template is binded to this
  data () {
    return {
      courses: [new Course(), new Course()],
      weekdayHours: '',
      weekendHours: '',
      courseform: true,
      results: false,
      timetable: [],
      days: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
      duration: {}
    }
  },

  methods: {
    addCourse () {
      this.courses.push(new Course())
    },
    deleteCourse (index) {
      this.courses.splice(index, 1)
    },
    computeResults () {
      // validation here, i don't even know how, cause we started with two empty courses I can't just test courses.length
      this.timetable = makeTable(this.courses, this.weekendHours, this.weekdayHours) // call makeTable above
      this.courseform = false // when we compute results, hide course form and show results
      this.results = true
      this.duration = {
        weekdays: periodduration(periodsperday(this.weekdayHours), this.weekdayHours),
        weekends: periodduration(periodsperday(this.weekendHours), this.weekendHours)
      }
    },
    editCourses () {
      // when we need to edit the courses
      this.results = false
      this.courseform = true
    }
  }
}
</script>

<style>
    select.form-control{
      display: block !important;
      border: 0;
      border-bottom: 1px solid #ccc;
    }

</style>