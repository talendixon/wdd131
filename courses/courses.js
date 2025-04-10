// ==========================================
// ✅ Activity 1 - Create and display a course
// ==========================================
const aCourse = {
    code: "CSE121b",
    name: "Javascript Language",
    sections: [
      {
        sectionNum: 1,
        roomNum: "STC 353",
        enrolled: 26,
        days: "TTh",
        instructor: "Bro T",
      },
      {
        sectionNum: 2,
        roomNum: "STC 347",
        enrolled: 25,
        days: "TTh",
        instructor: "Sis A",
      },
    ],
  
    // ==========================================
    // ✅ Activity 3 - Refactored method (stretch)
    // Combines enrollStudent and dropStudent
    // ==========================================
    changeEnrollment: function (sectionNum, add = true) {
      sectionNum = parseInt(sectionNum); // Ensure input is a number
      const sectionIndex = this.sections.findIndex(
        (section) => section.sectionNum === sectionNum
      );
      if (sectionIndex >= 0) {
        if (add) {
          this.sections[sectionIndex].enrolled++;
        } else {
          this.sections[sectionIndex].enrolled--;
        }
        renderSections(this.sections); // Re-render after change
      }
    },
  };
  
  // Function to set course name and code in the DOM
  function setCourseInfo(course) {
    document.querySelector("#courseName").textContent = course.name;
    document.querySelector("#courseCode").textContent = course.code;
  }
  
  // Template for each table row (section)
  function sectionTemplate(section) {
    return `<tr>
      <td>${section.sectionNum}</td>
      <td>${section.roomNum}</td>
      <td>${section.enrolled}</td>
      <td>${section.days}</td>
      <td>${section.instructor}</td>
    </tr>`;
  }
  
  // Render all sections to the table
  function renderSections(sections) {
    const html = sections.map(sectionTemplate);
    document.querySelector("#sections").innerHTML = html.join("");
  }
  
  // ==========================================
  // ✅ Activity 2 - Add Event Listeners for actions
  // ==========================================
  
  // Enroll button
  document.querySelector("#enrollStudent").addEventListener("click", () => {
    const sectionNum = document.querySelector("#sectionNumber").value;
    aCourse.changeEnrollment(sectionNum, true); // Add student
  });
  
  // Drop button
  document.querySelector("#dropStudent").addEventListener("click", () => {
    const sectionNum = document.querySelector("#sectionNumber").value;
    aCourse.changeEnrollment(sectionNum, false); // Remove student
  });
  
  // Initial page load: set course info and section list
  setCourseInfo(aCourse);
  renderSections(aCourse.sections);
  