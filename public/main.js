const form = document.getElementById('vote-form');

// form submit event
form.addEventListener('submit', (e) => {
    const choice = document.querySelector('input[name=pl]:checked').value;
    const data = {pl: choice};

    fetch('http://localhost:2000/poll', { // fetch request a promise
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err));

    e.preventDefault();
});

fetch('http://localhost:2000/poll').then(res => res.json()).then(data => {
    const votes = data.votes;
    const totalVotes = votes.length;
    // Count vote points - acc/current
    const voteCounts = votes.reduce((acc, vote) => ((acc[vote.pl] = (acc[vote.pl] || 0) + parseInt(vote.points)), acc), {});

    let dataPoints = [
        { label: 'Java', y: voteCounts.Java },
        { label: 'Javascript', y: voteCounts.Javascript },
        { label: 'Php', y: voteCounts.Php },
        { label: 'Python', y: voteCounts.Python },
    ];
    
    const chart = document.querySelector('#chart');
    
    if(chart) {
        const chart = new CanvasJS.Chart('chart', {
            animationEnabled: true,
            theme: 'theme1',
            title: {
                text: `Total Votes ${totalVotes}`
            },
            data: [
                {
                    type: 'column',
                    dataPoints: dataPoints
                }
            ]
        });
        chart.render();
    
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;
        
            var pusher = new Pusher('1841ebae5e98ee1c30da', {
              cluster: 'us2',
              encrypted: true
            });
        
            var channel = pusher.subscribe('pl-poll');
            channel.bind('pl-vote', function(data) {
              dataPoints = dataPoints.map(x => {
                  if(x.label == data.pl) {
                      x.y += data.points;
                      return x;
                  } else {
                      return x;
                  }
              });
              chart.render();
            });
    }
});

