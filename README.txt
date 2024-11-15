TODO:
Important:
 - fix reload button bug ✔
 - removeCild() diese eine reloadbtn Z.250 ✔

 - tweak eventlistener of the restartBtn
    - add extra const function

 const parent = document.getElementById('container');
 const child = document.getElementById('childElement');
 parent.removeChild(child);  

Styling:
 - make Buttons more appealing
 - myb add bootstrap

optional:

- background with levels


==================== LOG ======================
------ 14.11.2024 15:54
Reload button werden erstellt aber nicht freigelassen, entweder element löschen oder anderen weg finden
Wenn GameOver dann werden die Reload Buttons nicht zurückgesetzt

----- 15.11.2024 12:00
Reload button gets removed from document when pressed,  to avoid that multiple instance are present in the HTML 
