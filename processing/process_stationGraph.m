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
edgeStartCol = 5;

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


% create a Matlab cell struct that is convienent for the printing
for(i=1:length(stations.names))
    stationIdx = find(strcmpi(stations.names{i}, strtrim(names)));
    stations.x(i) = raw{headerOffset+stationIdx(1), xCol};
    stations.y(i) = raw{headerOffset+stationIdx(1), yCol};
    
    stations.connections{1}.line = raw{headerOffset+stationIdx(1), lineCol};
    rawConnections = {raw{headerOffset+stationIdx(1), edgeStartCol:end}};
    connections = {};
    for(j=1:length(rawConnections))
        if(~isnan(rawConnections{j}))
            connections{length(connections)+1} = rawConnections{j};
        end
    end
    stations.connections{1}.edges = connections;
    
    % second line entries
    for(j = 2:length(stationIdx))
        % error checking -  make sure x,y is same for all entries of the same station
        if(raw{headerOffset+stationIdx(j), xCol} ~= stations.x(i) || raw{headerOffset+stationIdx(j), yCol} ~= stations.y(i))
            warning(['x,y coordinates do not match for all entries of ' stations.names{i}]);
            haveErr= true;
        end
        
        stations.connections{j}.line = raw{headerOffset+stationIdx(j), lineCol};
        rawConnections = {raw{headerOffset+stationIdx(j), edgeStartCol:end}};
        connections = {};
        for(h=1:length(rawConnections))
            if(~isnan(rawConnections{h}))
                connections{length(connections)+1} = rawConnections{h};
            end
        end
        stations.connections{j}.edges = connections;
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
    fprintf(fid, '\t\t "%s": \n', 'connections');
    fprintf(fid, '\t\t\t[\n');
    for(j=1:length(stations.connections))
        fprintf(fid, '\t\t\t\t {\n');
        fprintf(fid, '\t\t\t\t\t "%s": "%s",\n', 'line', stations.connections{j}.line);
        fprintf(fid, '\t\t\t\t\t "%s": [\t', 'edges');
        for(k=1:length(stations.connections{j}.edges))
            fprintf(fid, '"%s"', stations.connections{j}.edges{k});
            if(k < length(stations.connections{j}.edges))
                fprintf(fid, ', ');
            end
        end
        fprintf(fid, '\t] \n');
        fprintf(fid, '\t\t\t\t }');
        if(j < length(stations.connections))
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

