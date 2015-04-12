function [  ] = process_writeLine( filename, stationData, line )
%PROCESS_WRITELINE writes the color line ie RED to filename as a JSON file
%
    fid = fopen(filename, 'w');
    fprintf(fid, '[\n');
        for(i=1:length(line))
            [x,y] = findStationLocation(line{i}, stationData);
            fprintf(fid, '\t{\n');
            fprintf(fid, '\t\t"x":%d,\n\t\t"y":%d\n', x, y);
            fprintf(fid, '\t}');
            if(i < length(line))
                % if its not the last element, add a comma
                fprintf(fid, ',');
            end
            fprintf(fid, '\n');
        end
    fprintf(fid, ']');
    fclose(fid);

end

function [x, y] = findStationLocation(station, stations)

    for(i=1:length(stations.names))
        if(strcmpi(stations.names{i}, strtrim(station)))
            x = stations.x(i);
            y = stations.y(i);
            return;
        end
    end

end
