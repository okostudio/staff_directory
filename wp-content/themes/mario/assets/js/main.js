let staff = {};
let staffMembers = {}
let StaffMemberContainer;
let teams = {
  selectedTeams: ['AllStaff'],
  sortBy: 'alpha'
};
let doc = {
  onFirstLoad: true
};


const init = function(){
  
  console.log('>> INIT')

  if(location.href.indexOf('smile') > -1){
    teams.sortBy = 'smile';
    document.querySelector('.nav .happy').classList.add('selected');
    document.querySelector('.nav .alpha').classList.remove('selected');
  } else {
    teams.sortBy = 'alpha';
  }

  $.getJSON('/wp-json/wp/v2/posts/?per_page=100', function(data) {
  // console.log(data)

    console.log('>> LOADED DATA')

    staff = data.map( staff_member => staff_member );
    StaffMemberContainer = document.querySelector('.staff-members');

    staff = staff.sort((b, a) => {
      if (a.first_name > b.first_name) return -1;
      if (a.first_name < b.first_name) return 1;
      return 0;
    });

    // Get a list of all team types:
    teams.types = ['AllStaff'];
    staff.map((member, i) => {

      // console.log(`
      // ${member.first_name + ' ' + member.last_name}
      // ${member.teams}`)
      
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

    // add teams members to AllStaff.
    if (!teams.AllStaff) teams.AllStaff = [];
    staff.map(member => {
      if (!member.teams.indexOf('AllStaff') - 1) member.teams.unshift('AllStaff');
      teams.AllStaff.push(member);
    });

    // arrange members into teams:
    teams.types.map(teamName => {
      if (teamName != 'AllStaff') teams[teamName] = [];

      // include link to team type into nav
      var teamNavItem = document.createElement('li');
      teamNavItem.className = 'sub-button ' + teamName;
      teamNavItem.setAttribute('data', teamName);
      teamNavItem.innerHTML = splitCamelCaseText(teamName)
      document.querySelector('#teams').appendChild(teamNavItem);
      teamNavItem.addEventListener('click', selectTeam)

      // include title for each section.
      var section = document.createElement('section');
      section.id = teamName;
      section.className = 'team';
      var title = document.createElement('h1');
      title.innerHTML = splitCamelCaseText(teamName);
      section.appendChild(title)
      StaffMemberContainer.appendChild(section);

      // arrange into teams
      staff.map(member => {
        
        if (member.teams.join(',').indexOf("," + teamName) > -1){
          if(teamName != 'AllStaff') teams[teamName].push(member);
        } 
      });      

      teams[teamName].map(staff_member_data => {
        const staffmember = new StaffMember(staff_member_data, section, photo.width, photo.height);
        staffMembers[staff_member_data.first_name + staff_member_data.last_name] = staffmember;
      })
      
    })
    // console.log(teams);


    document.getElementById('AllStaff').style.display = "block";
    document.querySelector('.nav .AllStaff').classList += " selected"
    from('#AllStaff', 0.3, {alpha: 0, ease: Power3.easeIn})

    initNav();
    addListeners();
    
    // Sort teams - also triggers resize;
    sortTeams(teams.sortBy);

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
  to('#' + team, 0.3, {
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    onComplete: hide,
    onCompleteParams: ['#' + team]
  }, 'inOut');
  teams.selectedTeams = removeStringFromArray(team, teams.selectedTeams);
  document.querySelector('.nav .' + team).classList.remove('selected');
}

function showTeam(team){
  const marginBottom = 60;
  const height = parseInt(document.querySelector('#' + team).getAttribute('data-height')) + marginBottom;
  console.log(height)
  set('#' + team, { height: height});
  from('#'+team, 0.3, {height: 0}, 'inOut');

  teams.selectedTeams.push(team);
  document.querySelector('.nav .' + team).classList.add('selected');
}

function onResize(e){
  const navWidth = 300;
  doc.width = window.innerWidth - navWidth;
  doc.height = window.innerHeight;
  photo.offsetX = photo.width + photo.marginLeft;
  photo.offsetY = photo.height + photo.marginBottom;

  const sections = Array.from(document.querySelectorAll('section'));
  const staffPerRow = Math.floor(doc.width / photo.offsetX);
  
  


  teams.types.map((teamName, i) => {
    const section = document.querySelector('#' + teamName);
    // const staffMembers = Array.from(section.querySelectorAll('.staff-member'));
    const team = teams[teamName];
    const sectionHeight = Math.ceil(team.length / staffPerRow);
    const sectionSize = {
      width: doc.width,
      height: sectionHeight * photo.offsetY
    }
    if (section.style.display != "none") {
      set(section, { width: sectionSize.width, height: sectionSize.height })
    }
    section.setAttribute('data-height', sectionSize.height);


    // cycle through each staff member.
    let offset = { x: 0, y: 0 }
    team.map((member, i) => {
      const el = section.querySelector('.member' + member.id);

      // define the x/y position of member, and include the x/y limits.
      el.setAttribute('data-position', (offset.x / photo.offsetX) + ',' + (offset.y / photo.offsetY) + ',' + (staffPerRow - 1) + ',' + (sectionHeight - 1));

      if (doc.onFirstLoad){
        // quickly position on first load
        set(el, {x: offset.x, y: offset.y});
      } else {
        // animated positioning
        let ease = Power3.easeOut;
        let time = 0.25;
        if (e.isSlow) {
          ease = Power3.easeInOut
          time = 0.4;
        }
        TweenMax.to(el, time, { x: offset.x, y: offset.y, ease: ease})
      }
      
      offset.x += photo.offsetX;

      if (offset.x >= staffPerRow * photo.offsetX) {
        offset.x = 0;
        offset.y += photo.offsetY;
      }

    })

    
  });

  to('section h1', 0.3, { width: staffPerRow * photo.offsetX - photo.marginLeft }, 'out')

  doc.onFirstLoad = false;
}



function sortTeams(method, isSlow = false){
  teams.types.map((team, i) => {
    // console.log(">> team")
    // console.log(teams[team])
    switch(method){
      case 'smile' : 
        teams[team] = teams[team].sort((b, a) => {
          if (!a.smile_index) a.smile_index = 0;
          if (!b.smile_index) b.smile_index = 0;
          if (a.smile_index < b.smile_index) return -1;
          if (a.smile_index > b.smile_index) return 1;
          return 0;
        });
        break;

      case 'alpha' :
        teams[team] = teams[team].sort((b, a) => {
          if (a.first_name > b.first_name) return -1;
          if (a.first_name < b.first_name) return 1;
          return 0;
        });
        break;

      default: break;
    }
    
  })
  
  onResize({isSlow: isSlow});
}


function addListeners() {
  console.log('>> Added listeners')
  window.addEventListener("resize", onResize);
}

//////////////////////////////////
$(document).ready(init)

