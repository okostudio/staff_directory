let staff = {};
let StaffMemberContainer;
let teams = {
  selectedTeams: ['AllStaff'],
  sortBy: 'alpha'
};
let doc = {};


const init = function(){
    
  if(location.href.indexOf('smile') > -1){
    teams.sortBy = 'smile';
    document.querySelector('.nav .happy').classList.add('selected');
    document.querySelector('.nav .alpha').classList.remove('selected');
  } else {
    teams.sortBy = 'alpha';
  }

  $.getJSON('/wp-json/wp/v2/posts/?per_page=100', function(data) {
  // console.log(data)

    staff = data.map( staff_member => staff_member );
    StaffMemberContainer = document.querySelector('.staff-members');

    // Sort staff alphabetically.
    if(teams.sortBy == 'alpha'){
      staff.sort( (a,b) => {
        if(a.first_name < b.first_name) return -1;
        if(a.first_name > b.first_name) return 1;
        return 0;
      });
    }

    // Sort staff by smile index.
    if(teams.sortBy == 'smile'){
      staff.sort( (b,a) => {
        if(!a.smile_index) a.smile_index = 0;
        if(!b.smile_index) b.smile_index = 0;
        if(a.smile_index < b.smile_index) return -1;
        if(a.smile_index > b.smile_index) return 1;
        return 0;
      });

    }

    

    // Get a list of all team types:
    teams.types = ['AllStaff'];
    staff.map((member, i) => {

      console.log(`
      ${member.first_name + ' ' + member.last_name}
      ${member.teams}`)
      

      member.teams.map(team => {
        if(teams.types.join(',').indexOf("," + team) == -1) teams.types.push(team);
      });
    })

    console.log(teams.types);


    // sort teams alphabeticaly
    teams.types.sort( (a,b) => {
      if(a < b) return -1; 
      if(a > b) return 1;
      return 0;
    })

    // arrange members into teams:
    teams.types.map(team => {
      teams[team] = [];

      // include link to team type into nav
      var teamNavItem = document.createElement('li');
      teamNavItem.className = 'sub-button ' + team;
      teamNavItem.setAttribute('data', team);
      teamNavItem.innerHTML = splitCamelCaseText(team)
      document.querySelector('#teams').appendChild(teamNavItem);
      teamNavItem.addEventListener('click', selectTeam)

      // include title for each section.
      var section = document.createElement('section');
      section.id = team;
      section.className = 'team';
      var title = document.createElement('h1');
      title.innerHTML = splitCamelCaseText(team);
      section.appendChild(title)
      StaffMemberContainer.appendChild(section);

      // arrange into teams
      staff.map(member => {

        if(!member.teams.indexOf('AllStaff') -1) member.teams.unshift('AllStaff');
        if(!teams.AllStaff) teams.AllStaff = [];
        teams.AllStaff.push(member);
        if(member.teams.join(',').indexOf("," + team) > -1) teams[team].push(member);
      })

      teams[team].map(staff_member_data => {
        new StaffMember(staff_member_data, section, 220, 220);        
      })
      
    })
    // console.log(teams);


    document.getElementById('AllStaff').style.display = "block";
    document.querySelector('.nav .AllStaff').classList += " selected"
    from('#AllStaff', 0.3, {alpha: 0, ease: Power3.easeIn})

    initNav();
    addListeners();
    onResize();

  });
}



function selectTeam(e){
  
  const team = this.getAttribute('data');

  // Special case for all staff - collapse all teams
  if(team == 'AllStaff'){
    if( this.classList.contains('selected') ){
      return('>> Already selected All Staff. Do Nothing')
    }else{
      console.log('Hide All Teams')
      teams.selectedTeams.map(_team => {
        if(_team != team)  hideTeam(_team);
      });
      showTeam(team)
      to(document.documentElement, 0.5, {scrollTop: 0}, 'inOut')
      return('>> All Staff Selected;')
    }
  }

  // Check if button is selected.
  if(this.classList.contains('selected')){
    // --- TEAM IS SELECTED
    hideTeam(team)
    if(teams.selectedTeams.length == 0){
      showTeam('AllStaff')
    }
  } else {
    // --- TEAM IS NOT SELECTED
    showTeam(team);
    if(teams.selectedTeams.indexOf('AllStaff') > -1){
      hideTeam('AllStaff')
    }

    to(document.documentElement, 0.5, {scrollTop: document.getElementById(team).offsetTop}, 'inOut')
  }

}

function hideTeam(team){
  to('#'+team, 0.3, {height: 0, marginTop: 0, marginBottom: 0}, 'inOut');
  teams.selectedTeams = removeStringFromArray(team, teams.selectedTeams);
  document.querySelector('.nav .' + team).classList.remove('selected');
}

function showTeam(team){
  const height = document.querySelector('#' + team).getAttribute('data-height');
  set('#' + team, { height: height, marginTop: 10, marginBottom: 50});
  from('#'+team, 0.3, {height: 0, marginTop: 0, marginBottom: 0}, 'inOut');

  teams.selectedTeams.push(team);
  document.querySelector('.nav .' + team).classList.add('selected');
}


function addListeners(){
  console.log('>> Added listeners')
  window.addEventListener("resize", onResize);
}

function onResize(e){
  doc.width = window.innerWidth - 300;
  doc.height = window.innerHeight;
  doc.staff = {
    width: 220,
    height: 220,
    marginLeft: 30,
    marginBottom: 80
  };

  const sections = Array.from(document.querySelectorAll('section'));
  const staffPerRow = Math.floor(doc.width / (doc.staff.height + doc.staff.marginLeft) );
  sections.map((section) => {
    const staffMembers = section.querySelectorAll('.staff-member');
    const sectionHeight = Math.ceil( staffMembers.length / staffPerRow );
    set(section, {
      width: doc.width,
      height: sectionHeight * (doc.staff.height + doc.staff.marginBottom)
    })
    section.setAttribute('data-height', sectionHeight * (doc.staff.height + doc.staff.marginBottom));
  });
  console.log(doc)
}


//////////////////////////////////
$(document).ready(init)



