<template>
    <div class="page-container card p-4">
      <div class="row animated fadeIn" v-if="courseform">
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
                            <input type="number" class="form-control" placeholder="Hours per weekday" v-model="weekdayHours" required>
                            
                            <small class="font-weight-light">How Many hours <b>per day</b> can you read on a weekday (Mon-Fri)</small>
                        </div>

                        <div class="md-form col-lg-6">
                          <input type="number" class="form-control" placeholder="Hours per weekend" v-model="weekendHours" required>
                          
                            <small class="font-weight-light">How Many hours <b>per day</b> can you read on a weekend (Sat-Sun)</small>
                        </div>  
                      </div>

                      


                      <small class="small d-block">What courses do you want to read</small>

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
                          <button class="btn btn-primary" id="add" @click="addCourse"><i class="fa fa-plus"></i> New Course</button>

                          <button class="btn btn-primary" type="submit" id="submit" @click.prevent="computeResults">Get Timetable</button>
                          
                      </div>
                  </div>
                  <!-- Material form register -->

              </div>
              <!-- Card body -->

          </div>
          <!-- Card -->
           
      </div>

      <div class="animated fadeIn" v-if="results">
        <p>Hello, The following study plan has been generated for you based on your request. Make sure to store it...</p>
        <div class="row">
          <div class="col-md-6">
            <p>Each period lasts <span class="text-primary">{{duration.weekdays}}</span> hours</p>
          </div>
          <div class="col-md-6 d-flex">
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
              <td v-for="(period, index) in timetable[index]">{{period.coursename}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      </div>

      
    </div>
</template>

<script>
// import Vue from 'vue'
class Course {
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

function periodsperday (hours) {
  if (hours <= 2) {
    return 1
  } else if (hours < 4) {
    return 2
  } else {
    return 3
  }
}

function insert (course, ppd, timetable) {
  // see if there's space left
  let x = Math.floor(Math.random() * timetable.length)
  let y = Math.floor(Math.random() * ppd)

  if (timetable[x][y] === null || timetable[x][y] === undefined) {
    timetable[x][y] = course
  } else if (spaceLeft(timetable)) {
    insert(course, ppd, timetable)
  }
}

function spaceLeft (timetable) {
  let i = 0
  timetable.forEach((day) => {
    if (day.length < 3) {
      i++
    }
  })
  if (i === 0) {
    return false
  } else {
    return true
  }
}

function makeTable (courses, weekendHours, weekdayHours) {
  let timetable = []
  let weeklyTimetable = Array(5)
  let weekendTimetable = Array(2)
  // periods per day
  let ppd = periodsperday(weekdayHours)
  // periods per week
  let ppw = 5 * ppd
  let ppwWeekends = 2 * periodsperday(weekendHours)

  // calc total priority to know how often each course occurs
  let totalpriority = 0
  for (let i = 0; i < courses.length; i++) {
    totalpriority += courses[i].priority()
  }

  for (let i = 0; i < weeklyTimetable.length; i++) {
    weeklyTimetable[i] = []
  }
  for (let i = 0; i < weekendTimetable.length; i++) {
    weekendTimetable[i] = []
  }

  // go through each cell in the timetable and fill it...
  for (let i = 0; i < courses.length; i++) {
    // for the number of times each course should occur
    for (let j = 0; j < courses[i].occurs(totalpriority, ppw); j++) {
      insert(courses[i], ppd, weeklyTimetable)
    }
    // same for weekends
    for (let k = 0; k < courses[i].occurs(totalpriority, ppwWeekends); k++) {
      insert(courses[i], periodsperday(weekendHours), weekendTimetable)
    }
  }
  weeklyTimetable.forEach((day) => timetable.push(day))
  weekendTimetable.forEach((day) => timetable.push(day))

  return timetable
}

export default{
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
      this.timetable = makeTable(this.courses, this.weekendHours, this.weekdayHours)
      this.courseform = false
      this.results = true
      this.duration = {
        weekdays: periodsperday(this.weekdayHours),
        weekends: periodsperday(this.weekendHours)
      }
    },
    editCourses () {
      this.results = false
      this.courseform = true
    }
  }
}

// let timetable = this.timetable

// console.log(timetable)
</script>

<style>
    select.form-control{
      display: block !important;
      border: 0;
      border-bottom: 1px solid #ccc;
    }

</style>