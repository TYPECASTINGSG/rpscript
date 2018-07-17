FROM node:8.11.3-slim

RUN npm install -g rpscript
RUN rps install basic
RUN echo "console-log 'hello world'" > test.rps

CMD rps test.rps
