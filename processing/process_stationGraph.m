% output format - JSON
%  Station
%       name : nameVal
%       connections : {
%           'red' : {connectedStationName1, connectedStationName2}
%           'orange' : {connectedStationName1, connectedStationName2}
%       }


% indexs of excel file columns
nameCol = 1;
lineCol = 2;
xCol = 3;
yCol = 4;
underGroundCol = 5;
idCol = 6;
edgeStartCol = 7;

% read in the excel file
[~,~, raw] = xlsread('station_graph.xls');
names = strtrim({raw{2:end,nameCol}});
stations.names = unique(names);

numStations = size(raw,1)-1;  % minus 1 for the header
headerOffset = 1;

haveErr = false;
% error check - to make sure all edges refer to a valid station
for(i=1:numStations)
    rawConnections = {raw{headerOffset+i, edgeStartCol:end}};
    connections = {};
    for(j=1:length(rawConnections))
        if(ischar(rawConnections{j}) || sum(isspace(rawConnections{j})) == length(rawConnections{j}))
            connections{length(connections)+1} = strtrim(rawConnections{j});
        end
    end
    for(j=1:length(connections))
        if(sum(strcmpi(connections{j}, stations.names)) == 0)
            warning([connections{j} ' (from ' names{i} ') is not in the station name list']);
            haveErr = true;     % use warning not error so all problems can be listed
        end
    end
end


%%

% create a Matlab cell struct that is convienent for the printing
for(i=1:length(stations.names))
    stationIdx = find(strcmpi(stations.names{i}, strtrim(names)));
    stations.x(i) = raw{headerOffset+stationIdx(1), xCol};
    stations.y(i) = raw{headerOffset+stationIdx(1), yCol};
    stations.underground(i) = raw{headerOffset+stationIdx(1), underGroundCol};
    stations.id(i) = raw{headerOffset+stationIdx(1), idCol};
    
    stations.connections{i}.line = {};
    stations.connections{i}.edges = {};
    stations.connections{i}.line{1} = raw{headerOffset+stationIdx(1), lineCol};
    rawConnections = {raw{headerOffset+stationIdx(1), edgeStartCol:end}};
    connections = {};
    for(j=1:length(rawConnections))
        if(~isnan(rawConnections{j}))
            connections{length(connections)+1} = rawConnections{j};
        end
    end
    stations.connections{i}.edges{1} = connections;
    
    % second line entries
    for(j = 2:length(stationIdx))
        % error checking -  make sure x,y is same for all entries of the same station
        if(raw{headerOffset+stationIdx(j), xCol} ~= stations.x(i) || raw{headerOffset+stationIdx(j), yCol} ~= stations.y(i))
            warning(['x,y coordinates do not match for all entries of ' stations.names{i}]);
            haveErr= true;
        end
        
        % if a station is both underground and aboveground mark it as
        % underground
        stations.underground(i) = max(stations.underground(i), raw{headerOffset+stationIdx(j), underGroundCol});
        
        stations.connections{i}.line{j} = raw{headerOffset+stationIdx(j), lineCol};
        rawConnections = {raw{headerOffset+stationIdx(j), edgeStartCol:end}};
        connections = {};
        for(h=1:length(rawConnections))
            if(~isnan(rawConnections{h}))
                connections{length(connections)+1} = rawConnections{h};
            end
        end
        stations.connections{i}.edges{j} = connections;
    end
end

if(haveErr)
    error('problem with input xls, not generating output json');
end

%% create the json data struct that represents the subway map graph
fid = fopen('station_map.json', 'w');

fprintf(fid, '[\n');

for(i=1:length(stations.names))
    fprintf(fid, '\t{\n');
    fprintf(fid, '\t\t "%s": "%s",\n', 'name', stations.names{i});
    fprintf(fid, '\t\t "%s": "%d",\n', 'x', stations.x(i));
    fprintf(fid, '\t\t "%s": "%d",\n', 'y', stations.y(i));
    fprintf(fid, '\t\t "%s": "%d",\n', 'underground', stations.underground(i));
    fprintf(fid, '\t\t "%s": "%d",\n', 'id', stations.id(i));
    fprintf(fid, '\t\t "%s": \n', 'connections');
    fprintf(fid, '\t\t\t[\n');
    for(j=1:length(stations.connections{i}.line))
        fprintf(fid, '\t\t\t\t {\n');
        fprintf(fid, '\t\t\t\t\t "%s": "%s",\n', 'line', stations.connections{i}.line{j});
        fprintf(fid, '\t\t\t\t\t "%s": [\t', 'edges');
        for(k=1:length(stations.connections{i}.edges{j}))
            fprintf(fid, '"%s"', stations.connections{i}.edges{j}{k});
            if(k < length(stations.connections{i}.edges{j}))
                fprintf(fid, ', ');
            end
        end
        fprintf(fid, '\t] \n');
        fprintf(fid, '\t\t\t\t }');
        if(j < length(stations.connections{i}.line))
            fprintf(fid, ', ');
        end
        fprintf(fid, '\n');
    end
    fprintf(fid, '\t\t\t]\n');
    fprintf(fid, '\t}');
    
    if(i < length(stations.names))
    	fprintf(fid, ', ');
    end
    fprintf(fid, '\n');
end

fprintf(fid, ']');

fclose(fid);


%%

%% create the json data struct that represents the subway map graph
Green = {'Lechmere', 'Science Park', 'North Station', 'Haymarket', 'Government Center', 'Park St', 'Boylston', 'Arlington', 'Copley', 'Hynes Convention Ctr', 'Kenmore'};
process_writeLine( 'line_green.json', stations, Green );
GreenE_underground = {'Copley', 'Prudential', 'Symphony'};
process_writeLine( 'line_greenE_underground.json', stations, GreenE_underground );
GreenE = {'Symphony', 'Northeastern', 'Museum of Fine Arts', ...
    'Longwood Medical Area', 'Brigham Circle', 'Fenwood Rd', 'Mission Park', ...
    'Riverway', 'Back of the Hill', 'Heath'};
process_writeLine( 'line_greenE.json', stations, GreenE );
GreenD = {'Kenmore', 'Fenway', 'Longwood', 'Brookline Village', ...
    'Brookline Hills', 'Beaconsfield', 'Reservoir', 'Chestnut Hill', 'Newton Centre', 'Newton Highlands', ...
    'Eliot', 'Waban', 'Woodland', 'Riverside'};
process_writeLine( 'line_greenD.json', stations, GreenD );
GreenC = {'Kenmore', 'St. Marys St', 'Hawes St', 'Kent St', 'St. Paul St C', 'Coolidge Corner', ...
    'Summit Ave', 'Brandon Hall', 'Fairbanks St', 'Washington Sq', 'Tappan St', ...
    'Dean Rd', 'Englewood Ave', 'Cleveland Circle'};
process_writeLine( 'line_greenC.json', stations, GreenC );
GreenB = {'Kenmore', 'Blandford St', 'BU East', 'BU Central', 'BU West', 'St. Paul St B', 'Pleasant St'...
    'Babcock St', 'Packards Corner', 'Harvard Ave', 'Griggs St', 'Allston St', 'Warren St', ...
    'Washington St', 'Sutherland Rd', 'Chiswick Rd', 'Chesnut Hill Ave', 'South St', 'Boston College'};
process_writeLine( 'line_greenB.json', stations, GreenB );

Blue = {'Bowdoin', 'Government Center', 'State', 'Aquarium', 'Maverick', 'Airport', ...
    'Wood Island', 'Orient Heights', 'Suffolk Downs', 'Beachmont', 'Revere Beach', 'Wonderland'};
process_writeLine( 'line_blue.json', stations, Blue );

Red = {'Alewife', 'Davis', 'Porter', 'Harvard', 'Central', 'Kendall/MIT', 'Charles/MGH', 'Park St',...
    'Downtown Crossing', 'South Station', 'Broadway', 'Andrew', 'JFK/UMass', 'Savin Hill', ...
    'Fields Corner', 'Shawmut', 'Ashmont'};
process_writeLine( 'line_red.json', stations, Red );
RedBrain = {'JFK/UMass', 'North Quincy', 'Wollaston', 'Quincy Center', 'Quincy Adams', 'Braintree'};
process_writeLine( 'line_redB.json', stations, RedBrain );
RedMattapan = {'Ashmont', 'Cedar Grove', 'Butler', 'Milton', 'Central Ave', ...
    'Valley Rd', 'Capen St', 'Mattapan'};
process_writeLine( 'line_redM.json', stations, RedMattapan );

Orange = {'Oak Grove', 'Malden Center', 'Wellington', 'Assembly', 'Sullivan Sq', 'Community College',...
    'North Station', 'Hay Market', 'State', 'Downtown Crossing', 'Chinatown', 'Tufts Medical Center', ...
    'Back Bay', 'Mass. Ave', 'Ruggles', 'Roxbury Crossing', 'Jackson Sq', 'Stony Brook', 'Green St', ...
    'Forest Hills'};
process_writeLine( 'line_orange.json', stations, Orange );

